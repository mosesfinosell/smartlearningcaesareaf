'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Class {
  _id: string;
  subject: {
    name: string;
    level: string;
  };
  students: any[];
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  zoomLink: string;
  status: string;
}

interface Assignment {
  _id: string;
  title: string;
  class: {
    subject: {
      name: string;
    };
  };
  dueDate: Date;
  submissions: any[];
  totalPoints: number;
}

type TutorProfile = {
  _id: string;
  userId: any;
  subjects?: Array<{
    name: string;
    level?: string;
  }>;
  verificationStatus?: string;
  rating?: number;
  totalReviews?: number;
  wallet?: {
    balance?: number;
    pendingEarnings?: number;
  };
};

export default function TutorDashboard() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'assignments' | 'earnings'>('classes');
  const [error, setError] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        router.push('/login');
        return;
      }

      const authHeaders = { 'Authorization': `Bearer ${token}` };

      // Fetch tutor profile using userId
      const profileRes = await fetch(`${apiBase}/tutors/user/${userId}`, {
        headers: authHeaders
      });
      const profileJson = await profileRes.json();
      const profileData = profileJson.data || profileJson;
      if (!profileRes.ok || !profileData) {
        throw new Error(profileJson.message || 'Failed to load profile');
      }
      setProfile(profileData as TutorProfile);

      // Fetch classes for this tutor
      const classesRes = await fetch(`${apiBase}/classes/tutor/${userId}`, {
        headers: authHeaders
      });
      const classesJson = await classesRes.json();
      const rawClasses = classesJson.data || classesJson || [];
      const normalizedClasses: Class[] = rawClasses.map((cls: any) => ({
        _id: cls._id,
        subject: {
          name: cls.subject?.name || cls.subjectId?.name || 'Subject',
          level: cls.subject?.level || cls.subjectId?.level || cls.curriculum || ''
        },
        students: cls.students || [],
        schedule: Array.isArray(cls.schedule)
          ? cls.schedule
          : cls.schedule
            ? [{
              day: cls.schedule.day,
              startTime: cls.schedule.startTime,
              endTime: cls.schedule.endTime
            }]
            : [],
        zoomLink: cls.zoomLink || '',
        status: cls.status || (cls.isActive ? 'active' : 'inactive')
      }));
      setClasses(normalizedClasses);

      // Fetch assignments created by this tutor
      const assignmentsRes = await fetch(`${apiBase}/assignments?tutorId=${userId}`, {
        headers: authHeaders
      });
      const assignmentsJson = await assignmentsRes.json();
      const rawAssignments = assignmentsJson.data || assignmentsJson || [];
      const normalizedAssignments: Assignment[] = rawAssignments.map((assignment: any) => ({
        _id: assignment._id,
        title: assignment.title || 'Assignment',
        class: {
          subject: {
            name: assignment.class?.subject?.name || assignment.subjectId?.name || 'Subject'
          }
        },
        dueDate: assignment.dueDate,
        submissions: assignment.submissions || [],
        totalPoints: assignment.totalPoints || assignment.maxScore || 0,
      }));
      setAssignments(normalizedAssignments);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Could not load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-2xl text-maroon">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-maroon mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-maroon text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const firstName = profile.userId?.profile?.firstName || profile.userId?.firstName || 'Tutor';
  const lastName = profile.userId?.profile?.lastName || profile.userId?.lastName || '';
  const rating = Number(profile.rating || (profile as any).rating?.overall || 0) || 0;
  const walletBalance = profile.wallet?.balance || 0;
  const walletPending = profile.wallet?.pendingEarnings || 0;
  const verification = profile.verificationStatus === 'approved' ? '✓ Verified' : '⏳ Pending';

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
            <p className="text-gold mt-1">Welcome, {firstName} {lastName}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm opacity-90">Verification Status</p>
              <p className="text-lg font-semibold">{verification}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-maroon px-4 py-2 rounded-lg font-semibold hover:bg-gold hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Classes"
            value={classes.length}
            color="bg-maroon"
            icon="📚"
          />
          <StatCard
            title="Active Students"
            value={classes.reduce((sum, c) => sum + c.students.length, 0)}
            color="bg-gold"
            icon="👥"
          />
          <StatCard
            title="Assignments"
            value={assignments.length}
            color="bg-blue-600"
            icon="📝"
          />
          <StatCard
            title="Rating"
            value={`${rating.toFixed(1)} ⭐`}
            color="bg-green-600"
            icon="⭐"
          />
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-4xl font-bold mt-1">₦{walletBalance.toLocaleString()}</p>
              <p className="text-sm mt-2">Pending: ₦{walletPending.toLocaleString()}</p>
            </div>
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('classes')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'classes' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              My Classes
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'assignments' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'earnings' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Earnings History
            </button>
          </div>

          <div className="p-6">
            {/* Classes Tab */}
            {activeTab === 'classes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-maroon">My Classes</h2>
                  <Link href="/tutor/classes/create">
                    <button className="bg-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">
                      + Create New Class
                    </button>
                  </Link>
                </div>

                {classes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No classes yet</p>
                    <p className="text-gray-400 mt-2">Create your first class to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classes.map((classItem) => (
                      <div key={classItem._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-maroon">
                              {classItem.subject.name}
                            </h3>
                            <p className="text-sm text-gray-600">{classItem.subject.level}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            classItem.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {classItem.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-700">
                            👥 {classItem.students.length} Students
                          </p>
                          {classItem.schedule.map((sched, idx) => (
                            <p key={idx} className="text-sm text-gray-700">
                              📅 {sched.day}: {sched.startTime} - {sched.endTime}
                            </p>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/tutor/classes/${classItem._id}`} className="flex-1">
                            <button className="w-full bg-maroon text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-900">
                              View Details
                            </button>
                          </Link>
                          {classItem.zoomLink && (
                            <a href={classItem.zoomLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                              <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                                Join Class
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-maroon">Assignments</h2>
                  <Link href="/tutor/assignments/create">
                    <button className="bg-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">
                      + Create Assignment
                    </button>
                  </Link>
                </div>

                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments yet</p>
                    <p className="text-gray-400 mt-2">Create your first assignment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-maroon">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {assignment.class.subject.name}
                            </p>
                            <div className="mt-3 flex items-center gap-4 text-sm text-gray-700">
                              <span>📝 {assignment.submissions.length} Submissions</span>
                              <span>📊 {assignment.totalPoints} Points</span>
                              <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Link href={`/tutor/assignments/${assignment._id}`}>
                            <button className="bg-maroon text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-900">
                              Grade Submissions
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <h2 className="text-2xl font-bold text-maroon mb-6">Earnings History</h2>
                <div className="text-center py-12">
                  <p className="text-gray-500">Earnings history will be displayed here</p>
                  <p className="text-gray-400 mt-2">Track all your payments and withdrawals</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: string }) {
  return (
    <div className={`${color} text-white rounded-lg p-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl opacity-75">{icon}</span>
      </div>
    </div>
  );
}
