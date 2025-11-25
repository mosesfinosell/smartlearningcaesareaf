'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Assignment {
  _id: string;
  title: string;
  dueDate: Date;
  totalPoints: number;
  submission?: {
    score?: number;
    submittedAt: Date;
  };
}

interface ClassDetail {
  _id: string;
  subject: {
    name: string;
    level: string;
  };
  description: string;
  tutor: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
    };
    rating: number;
    totalReviews: number;
  };
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  zoomLink: string;
}

export default function StudentClassDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassData();
    fetchAssignments();
  }, [params.id]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/classes/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setClassData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching class:', error);
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/assignments?classId=${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-2xl text-maroon">Loading...</div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-maroon mb-4">Class not found</p>
          <Link href="/student/dashboard">
            <button className="bg-maroon text-white px-6 py-2 rounded-lg">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const pendingAssignments = assignments.filter(a => !a.submission);
  const completedAssignments = assignments.filter(a => a.submission);

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link href="/student/dashboard" className="text-gold hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{classData.subject.name}</h1>
          <p className="text-gold mt-1">{classData.subject.level}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Pending Assignments</p>
            <p className="text-3xl font-bold text-gold mt-1">{pendingAssignments.length}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{completedAssignments.length}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Class Schedule</p>
            <p className="text-3xl font-bold text-maroon mt-1">{classData.schedule.length} sessions/week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About This Class */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-maroon mb-4">About This Class</h2>
              <p className="text-gray-700 leading-relaxed">{classData.description}</p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-maroon mb-4">Class Schedule</h2>
              <div className="space-y-3">
                {classData.schedule.map((slot, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{slot.day}</p>
                      <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                    </div>
                    <a 
                      href={classData.zoomLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      Join Class
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-maroon mb-4">Assignments</h2>

              {/* Pending Assignments */}
              {pendingAssignments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Pending ({pendingAssignments.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingAssignments.map((assignment) => (
                      <div key={assignment._id} className="border-l-4 border-gold bg-yellow-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
                            <div className="mt-2 flex items-center gap-4 text-sm">
                              <span className="text-red-600 font-semibold">
                                📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                              <span className="text-gray-600">📊 {assignment.totalPoints} points</span>
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

              {/* Completed Assignments */}
              {completedAssignments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Completed ({completedAssignments.length})
                  </h3>
                  <div className="space-y-3">
                    {completedAssignments.map((assignment) => (
                      <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Submitted: {new Date(assignment.submission!.submittedAt).toLocaleDateString()}
                            </p>
                            {assignment.submission?.score !== undefined && (
                              <div className="mt-2">
                                <span className="text-2xl font-bold text-green-600">
                                  {assignment.submission.score}/{assignment.totalPoints}
                                </span>
                                <span className="ml-2 text-sm text-gray-600">
                                  ({((assignment.submission.score / assignment.totalPoints) * 100).toFixed(0)}%)
                                </span>
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
                  <p className="text-gray-500">No assignments yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tutor Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-maroon mb-4">Your Tutor</h3>
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-maroon rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {classData.tutor.userId.firstName[0]}{classData.tutor.userId.lastName[0]}
                </div>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {classData.tutor.userId.firstName} {classData.tutor.userId.lastName}
                </h4>
                <p className="text-sm text-gray-600">{classData.tutor.userId.email}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-bold text-gray-800">
                    {classData.tutor.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {classData.tutor.totalReviews} reviews
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-maroon mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a 
                  href={classData.zoomLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Join Live Class
                </a>
                <Link href={`/student/classes/${params.id}/materials`}>
                  <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700">
                    View Materials
                  </button>
                </Link>
                <Link href={`/student/classes/${params.id}/progress`}>
                  <button className="w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-red-900">
                    My Progress
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
