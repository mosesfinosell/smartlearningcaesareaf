'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Student {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  grade: string;
  parent: {
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

interface Assignment {
  _id: string;
  title: string;
  dueDate: Date;
  submissions: any[];
  totalPoints: number;
}

interface ClassDetail {
  _id: string;
  subject: {
    name: string;
    level: string;
  };
  description: string;
  students: Student[];
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  zoomLink: string;
  maxStudents: number;
  pricePerMonth: number;
  status: string;
  tutor: {
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments'>('overview');

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

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to remove this student?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/classes/${params.id}/students/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Student removed successfully');
        fetchClassData();
      }
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student');
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/classes/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Class status updated');
        fetchClassData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
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
          <Link href="/tutor/dashboard">
            <button className="bg-maroon text-white px-6 py-2 rounded-lg">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link href="/tutor/dashboard" className="text-gold hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{classData.subject.name}</h1>
              <p className="text-gold mt-1">{classData.subject.level}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                classData.status === 'active' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}>
                {classData.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Enrolled Students</p>
            <p className="text-3xl font-bold text-maroon mt-1">
              {classData.students.length}/{classData.maxStudents}
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Assignments</p>
            <p className="text-3xl font-bold text-maroon mt-1">{assignments.length}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Price per Month</p>
            <p className="text-3xl font-bold text-maroon mt-1">₦{classData.pricePerMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Schedule Slots</p>
            <p className="text-3xl font-bold text-maroon mt-1">{classData.schedule.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'overview' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'students' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Students ({classData.students.length})
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'assignments' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Assignments ({assignments.length})
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-maroon mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{classData.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-maroon mb-3">Schedule</h3>
                  <div className="space-y-2">
                    {classData.schedule.map((slot, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-800">{slot.day}</p>
                        <p className="text-gray-600">{slot.startTime} - {slot.endTime}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-maroon mb-3">Zoom Meeting</h3>
                  <a 
                    href={classData.zoomLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Join Class Meeting →
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-maroon mb-3">Class Status</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateStatus('active')}
                      disabled={classData.status === 'active'}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Set Active
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('inactive')}
                      disabled={classData.status === 'inactive'}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Set Inactive
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      disabled={classData.status === 'completed'}
                      className="px-6 py-2 bg-maroon text-white rounded-lg font-semibold hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                {classData.students.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classData.students.map((student) => (
                      <div key={student._id} className="border border-gray-200 rounded-lg p-5 flex justify-between items-start hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white text-lg font-bold">
                            {student.userId.firstName[0]}{student.userId.lastName[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">
                              {student.userId.firstName} {student.userId.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{student.userId.email}</p>
                            <p className="text-sm text-gray-600">Grade: {student.grade}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Parent: {student.parent.userId.firstName} {student.parent.userId.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/tutor/students/${student._id}/progress`}>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                              View Progress
                            </button>
                          </Link>
                          <button
                            onClick={() => handleRemoveStudent(student._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                          >
                            Remove
                          </button>
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
                  <h3 className="text-xl font-bold text-maroon">Class Assignments</h3>
                  <Link href={`/tutor/assignments/create?classId=${params.id}`}>
                    <button className="bg-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">
                      + Create Assignment
                    </button>
                  </Link>
                </div>

                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No assignments yet</p>
                    <p className="text-gray-400 mt-2">Create your first assignment for this class</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-semibold text-maroon">{assignment.title}</h4>
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
          </div>
        </div>
      </div>
    </div>
  );
}
