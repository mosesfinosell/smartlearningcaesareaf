'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Class = {
  _id: string;
  subject: {
    name: string;
    level?: string;
  };
  tutor: {
    userId: {
      firstName: string;
      lastName: string;
    };
    rating?: number;
  };
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  zoomLink?: string;
};

type Assignment = {
  _id: string;
  title: string;
  description?: string;
  class: {
    subject: {
      name: string;
    };
  };
  dueDate?: Date | string;
  totalPoints: number;
  submission?: {
    submittedAt?: Date | string;
    score?: number;
    feedback?: string;
  };
};

type ProgressReport = {
  _id: string;
  class: {
    subject: {
      name: string;
    };
  };
  overallGrade: string | number;
  attendance: number;
  comments: string;
  createdAt?: Date | string;
};

type StudentProfile = {
  _id: string;
  userId: any;
  parentId?: any;
};

export default function StudentDashboard() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'assignments' | 'progress'>('classes');
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

      // Fetch student profile using userId
      const profileRes = await fetch(`${apiBase}/students/user/${userId}`, {
        headers: authHeaders
      });
      const profileJson = await profileRes.json();
      if (!profileRes.ok || !profileJson.data) {
        throw new Error(profileJson.message || 'Failed to load profile');
      }
      const studentProfile = profileJson.data as StudentProfile;
      setProfile(studentProfile);

      const studentId = studentProfile._id;

      // Fetch enrolled classes
      const classesRes = await fetch(`${apiBase}/classes/student/${studentId}`, {
        headers: authHeaders
      });
      const classesJson = await classesRes.json();
      const classesData = (classesJson.data || classesJson || []) as any[];
      const normalizedClasses: Class[] = classesData.map((cls) => ({
        _id: cls._id,
        subject: {
          name: cls.subject?.name || cls.subjectId?.name || 'Subject',
          level: cls.subject?.level || cls.curriculum
        },
        tutor: {
          userId: {
            firstName: cls.tutor?.userId?.firstName || cls.tutorId?.profile?.firstName || 'Tutor',
            lastName: cls.tutor?.userId?.lastName || cls.tutorId?.profile?.lastName || ''
          },
          rating: cls.tutor?.rating || cls.tutorId?.rating
        },
        schedule: Array.isArray(cls.schedule)
          ? cls.schedule
          : cls.schedule
            ? [{
              day: cls.schedule.day,
              startTime: cls.schedule.startTime,
              endTime: cls.schedule.endTime
            }]
            : [],
        zoomLink: cls.zoomLink || cls.sessions?.[0]?.zoomMeetingLink
      }));
      setClasses(normalizedClasses);

      // Fetch assignments with submissions
      const assignmentsRes = await fetch(`${apiBase}/assignments/student/${studentId}`, {
        headers: authHeaders
      });
      const assignmentsJson = await assignmentsRes.json();
      const assignmentsData = (assignmentsJson.data || assignmentsJson || []) as any[];
      const normalizedAssignments: Assignment[] = assignmentsData.map((item) => {
        const assignment = item.assignment || item;
        return {
          _id: assignment.id || assignment._id || 'assignment',
          title: assignment.title || 'Assignment',
          description: assignment.description || assignment.instructions || '',
          class: {
            subject: {
              name: assignment.class?.subject?.name
                || assignment.subject?.name
                || assignment.subjectId?.name
                || 'Subject'
            }
          },
          dueDate: assignment.dueDate,
          totalPoints: assignment.maxScore ?? assignment.totalPoints ?? 0,
          submission: item.submission || assignment.submission
        };
      });
      setAssignments(normalizedAssignments);

      // Fetch progress reports
      const reportsRes = await fetch(`${apiBase}/progress-reports/student/${studentId}`, {
        headers: authHeaders
      });
      const reportsJson = await reportsRes.json();
      const reportsData = (reportsJson.data || reportsJson || []) as any[];
      const normalizedReports: ProgressReport[] = reportsData.map((report) => ({
        _id: report._id,
        class: {
          subject: {
            name:
              report.class?.subject?.name ||
              report.subjects?.[0]?.subjectId?.name ||
              'Subject'
          }
        },
        overallGrade:
          report.overallGrade ||
          report.overallPerformance?.overallGrade ||
          report.overallPerformance?.overallPercentage ||
          'N/A',
        attendance:
          report.attendance ??
          report.overallPerformance?.overallAttendance ??
          0,
        comments:
          report.comments ||
          report.subjects?.[0]?.tutorComments ||
          'No comments yet',
        createdAt: report.createdAt || report.period?.endDate
      }));
      setReports(normalizedReports);

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

  const firstName = profile.userId?.profile?.firstName || profile.userId?.firstName || 'Student';
  const lastName = profile.userId?.profile?.lastName || profile.userId?.lastName || '';
  const email = profile.userId?.email || profile.userId?.profile?.email || '';
  const parentFirst =
    profile.parentId?.userId?.profile?.firstName || profile.parentId?.userId?.firstName || '';
  const parentLast =
    profile.parentId?.userId?.profile?.lastName || profile.parentId?.userId?.lastName || '';

  const pendingAssignments = assignments.filter(a => !a.submission);
  const gradedAssignments = assignments.filter(a => a.submission?.score !== undefined);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-gold mt-1">
              Welcome back, {firstName}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-maroon px-4 py-2 rounded-lg font-semibold hover:bg-gold hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Enrolled Classes"
            value={classes.length}
            color="bg-maroon"
            icon={<i className="fa-solid fa-book-open" aria-hidden="true" />}
          />
          <StatCard
            title="Pending Assignments"
            value={pendingAssignments.length}
            color="bg-gold"
            icon={<i className="fa-solid fa-pen-to-square" aria-hidden="true" />}
          />
          <StatCard
            title="Completed"
            value={gradedAssignments.length}
            color="bg-green-600"
            icon={<i className="fa-solid fa-circle-check" aria-hidden="true" />}
          />
          <StatCard
            title="Progress Reports"
            value={reports.length}
            color="bg-blue-600"
            icon={<i className="fa-solid fa-chart-line" aria-hidden="true" />}
          />
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-maroon rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {(firstName || 'S')[0]}
              {(lastName || '')[0] || ''}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-maroon">
                {firstName} {lastName}
              </h2>
              {email && (
                <p className="text-gray-600">
                  Email: {email}
                </p>
              )}
              {parentFirst && (
                <p className="text-gray-600">
                  Parent: {parentFirst} {parentLast}
                </p>
              )}
            </div>
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
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'progress' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Progress Reports
            </button>
          </div>

          <div className="p-6">
            {/* Classes Tab */}
            {activeTab === 'classes' && (
              <div>
                <h2 className="text-2xl font-bold text-maroon mb-6">My Classes</h2>
                {classes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No enrolled classes</p>
                    <p className="text-gray-400 mt-2">Contact your parent to enroll in classes</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classes.map((classItem) => (
                      <div key={classItem._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-semibold text-maroon mb-2">
                          {classItem.subject.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{classItem.subject.level || ''}</p>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <i className="fa-solid fa-chalkboard-user text-gold" aria-hidden="true" />
                            <span>
                              Tutor: {classItem.tutor.userId.firstName} {classItem.tutor.userId.lastName}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <i className="fa-solid fa-star text-gold" aria-hidden="true" />
                            <span>Rating: {(classItem.tutor.rating || 0).toFixed(1)}</span>
                          </p>
                          {classItem.schedule.map((sched, idx) => (
                            <p key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                              <i className="fa-regular fa-calendar text-gold" aria-hidden="true" />
                              <span>{sched.day}: {sched.startTime} - {sched.endTime}</span>
                            </p>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/student/classes/${classItem._id}`} className="flex-1">
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
                <h2 className="text-2xl font-bold text-maroon mb-6">Assignments</h2>
                
                {/* Pending Assignments */}
                {pendingAssignments.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending ({pendingAssignments.length})</h3>
                    <div className="space-y-4">
                      {pendingAssignments.map((assignment) => (
                        <div key={assignment._id} className="border-l-4 border-gold bg-yellow-50 rounded-lg p-5">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-maroon">{assignment.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{assignment.class.subject.name}</p>
                              <p className="text-sm text-gray-700 mt-2">{assignment.description}</p>
                              <div className="mt-3 flex items-center gap-4 text-sm">
                                <span className="text-red-600 font-semibold flex items-center gap-2">
                                  <i className="fa-regular fa-calendar-days" aria-hidden="true" />
                                  <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'TBD'}</span>
                                </span>
                                <span className="text-gray-700 flex items-center gap-2">
                                  <i className="fa-solid fa-chart-bar text-gold" aria-hidden="true" />
                                  <span>{assignment.totalPoints} Points</span>
                                </span>
                              </div>
                            </div>
                            <Link href={`/student/assignments/${assignment._id}/submit`}>
                              <button className="bg-gold text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 whitespace-nowrap">
                                Submit Work
                              </button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Graded Assignments */}
                {gradedAssignments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Graded ({gradedAssignments.length})</h3>
                    <div className="space-y-4">
                      {gradedAssignments.map((assignment) => (
                        <div key={assignment._id} className="border border-gray-200 rounded-lg p-5">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-maroon">{assignment.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{assignment.class.subject.name}</p>
                              <div className="mt-3">
                                <span className="text-2xl font-bold text-green-600">
                                  {assignment.submission?.score}/{assignment.totalPoints}
                                </span>
                                <span className="ml-2 text-sm text-gray-600">
                                  ({((assignment.submission?.score || 0) / assignment.totalPoints * 100).toFixed(0)}%)
                                </span>
                              </div>
                              {assignment.submission?.feedback && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm font-semibold text-blue-900">Tutor Feedback:</p>
                                  <p className="text-sm text-blue-800 mt-1">{assignment.submission.feedback}</p>
                                </div>
                              )}
                            </div>
                            <Link href={`/student/assignments/${assignment._id}`}>
                              <button className="bg-maroon text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-900">
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {assignments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress Reports Tab */}
            {activeTab === 'progress' && (
              <div>
                <h2 className="text-2xl font-bold text-maroon mb-6">Progress Reports</h2>
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No progress reports yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report._id} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-maroon">
                              {report.class.subject.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-xl">
                            {report.overallGrade}
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <i className="fa-solid fa-chart-column text-gold" aria-hidden="true" />
                            <span>Attendance: {report.attendance}%</span>
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Tutor Comments:</p>
                          <p className="text-sm text-gray-800">{report.comments}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: ReactNode }) {
  return (
    <div className={`${color} text-white rounded-lg p-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl opacity-75 [&>*]:align-middle">{icon}</span>
      </div>
    </div>
  );
}
