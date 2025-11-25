'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface TutorData {
  id: string;
  tutorCode: string;
  userId: {
    profile: {
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
  };
  overallVerificationStatus: string;
  rating: {
    overall: number;
    totalReviews: number;
  };
  statistics: {
    totalClasses: number;
    totalStudents: number;
    averageAttendance: number;
  };
  earnings: {
    totalEarned: number;
    pendingEarnings: number;
  };
}

export default function TutorDashboard() {
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorData | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await api.get('/auth/profile');
      const userId = userRes.data.data.id;

      const tutorRes = await api.get(`/tutors/user/${userId}`);
      const tutorData = tutorRes.data.data;
      setTutor(tutorData);

      const classesRes = await api.get(`/classes/tutor/${tutorData.id}`);
      setClasses(classesRes.data.data);

      const today = new Date().toLocaleString('en-US', { weekday: 'long' });
      const todayClassesFiltered = classesRes.data.data.filter(
        (c: any) => c.schedule?.day === today
      );
      setTodayClasses(todayClassesFiltered);

      const assignmentsRes = await api.get(`/assignments?tutorId=${tutorData.id}`);
      const pending = assignmentsRes.data.data.filter(
        (a: any) => a.submissions?.some((s: any) => s.status === 'submitted')
      );
      setPendingAssignments(pending.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A05C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No tutor profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <header className="bg-white shadow-sm border-b border-[#C9A05C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {tutor.userId.profile.profilePicture ? (
                <img
                  src={tutor.userId.profile.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-[#C9A05C]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#C9A05C] flex items-center justify-center text-white font-semibold">
                  {tutor.userId.profile.firstName[0]}
                  {tutor.userId.profile.lastName[0]}
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome back, {tutor.userId.profile.firstName}!
                </h1>
                <p className="text-sm text-gray-600">
                  Tutor Portal • {tutor.tutorCode}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                tutor.overallVerificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tutor.overallVerificationStatus === 'verified' ? '✓ Verified' : 'Pending Verification'}
              </span>
              <button
                onClick={() => router.push('/tutor/profile')}
                className="px-4 py-2 text-sm border border-[#C9A05C] text-[#C9A05C] rounded-lg hover:bg-[#C9A05C] hover:text-white transition"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Classes</p>
                <p className="text-3xl font-bold text-[#C9A05C] mt-1">
                  {tutor.statistics.totalClasses}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#C9A05C]/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {tutor.statistics.totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍🎓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {tutor.rating.overall.toFixed(1)} ⭐
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {tutor.rating.totalReviews} reviews
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ₦{tutor.earnings.totalEarned.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Pending: ₦{tutor.earnings.pendingEarnings.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="p-6">
                {todayClasses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No classes scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayClasses.map((classItem) => {
                      const nextSession = classItem.sessions.find((s: any) => s.status === 'scheduled');
                      return (
                        <div
                          key={classItem._id}
                          className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#C9A05C] rounded-lg flex items-center justify-center text-white font-semibold">
                              {classItem.subjectId?.code?.slice(0, 2) || 'CL'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {classItem.subjectId?.name || 'Class'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {classItem.currentEnrollment} students enrolled
                              </p>
                              <p className="text-sm text-gray-500">
                                {classItem.schedule?.startTime} - {classItem.schedule?.endTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {nextSession?.zoomMeetingLink && (
                              <a
                                href={nextSession.zoomMeetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[#0E72ED] text-white rounded-lg hover:bg-[#0E72ED]/90 transition text-sm font-medium"
                              >
                                Start Class
                              </a>
                            )}
                            <button
                              onClick={() => router.push(`/tutor/classes/${classItem._id}`)}
                              className="px-4 py-2 border border-[#C9A05C] text-[#C9A05C] rounded-lg hover:bg-[#C9A05C] hover:text-white transition text-sm"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Pending Grading</h2>
                <button
                  onClick={() => router.push('/tutor/assignments')}
                  className="text-sm text-[#C9A05C] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="p-6">
                {pendingAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">All caught up! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingAssignments.map((assignment) => (
                      <div
                        key={assignment._id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#C9A05C] transition cursor-pointer"
                        onClick={() => router.push(`/tutor/assignments/${assignment._id}`)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">
                            {assignment.submissions?.filter((s: any) => s.status === 'submitted').length} submissions pending
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Grade Now
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/tutor/classes/create')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#8B1538] text-white rounded-lg hover:bg-[#8B1538]/90 transition"
                >
                  <span className="text-2xl">➕</span>
                  <span className="font-medium">Create New Class</span>
                </button>
                <button
                  onClick={() => router.push('/tutor/classes')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">📚</span>
                  <span className="font-medium text-gray-900">My Classes</span>
                </button>
                <button
                  onClick={() => router.push('/tutor/students')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">👨‍🎓</span>
                  <span className="font-medium text-gray-900">My Students</span>
                </button>
                <button
                  onClick={() => router.push('/tutor/assignments')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">📝</span>
                  <span className="font-medium text-gray-900">Assignments</span>
                </button>
                <button
                  onClick={() => router.push('/tutor/earnings')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">💰</span>
                  <span className="font-medium text-gray-900">Earnings</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">All My Classes</h3>
              {classes.length === 0 ? (
                <p className="text-sm text-gray-500">No classes created yet</p>
              ) : (
                <div className="space-y-3">
                  {classes.slice(0, 5).map((classItem) => (
                    <div
                      key={classItem._id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#C9A05C] transition cursor-pointer"
                      onClick={() => router.push(`/tutor/classes/${classItem._id}`)}
                    >
                      <div className="w-10 h-10 bg-[#C9A05C]/10 rounded-lg flex items-center justify-center text-[#C9A05C] font-semibold text-sm">
                        {classItem.subjectId?.code?.slice(0, 2) || 'CL'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {classItem.subjectId?.name || 'Class'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {classItem.currentEnrollment} students
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
