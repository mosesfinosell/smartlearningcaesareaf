'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Assignment {
  _id: string;
  title: string;
  class: {
    subject: {
      name: string;
    };
  };
  totalPoints: number;
  submission?: {
    score: number;
    submittedAt: Date;
  };
  dueDate: Date;
}

interface ProgressReport {
  _id: string;
  class: {
    subject: {
      name: string;
    };
  };
  overallGrade: string;
  attendance: number;
  strengths: string[];
  areasForImprovement: string[];
  comments: string;
  createdAt: Date;
}

interface Class {
  _id: string;
  subject: {
    name: string;
    level: string;
  };
  tutor: {
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

interface Child {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  grade: string;
  classes: Class[];
}

export default function ChildProgressPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [child, setChild] = useState<Child | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'reports'>('overview');

  useEffect(() => {
    fetchChildData();
  }, [params.id]);

  const fetchChildData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch child profile
      const childRes = await fetch(`${apiBase}/students/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const childData = await childRes.json();
      setChild(childData);

      // Fetch assignments
      const assignmentsRes = await fetch(`${apiBase}/students/${params.id}/assignments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const assignmentsData = await assignmentsRes.json();
      setAssignments(assignmentsData);

      // Fetch progress reports
      const reportsRes = await fetch(`${apiBase}/progress-reports/student/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const reportsData = await reportsRes.json();
      setReports(reportsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  if (!child) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-maroon mb-4">Child not found</p>
          <Link href="/parent/dashboard">
            <button className="bg-maroon text-white px-6 py-2 rounded-lg">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const gradedAssignments = assignments.filter(a => a.submission?.score !== undefined);
  const averageScore = gradedAssignments.length > 0
    ? gradedAssignments.reduce((sum, a) => sum + (a.submission!.score / a.totalPoints * 100), 0) / gradedAssignments.length
    : 0;

  const pendingAssignments = assignments.filter(a => !a.submission);
  const completedAssignments = assignments.filter(a => a.submission);

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link href="/parent/dashboard" className="text-gold hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-maroon text-2xl font-bold">
              {child.userId.firstName[0]}{child.userId.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {child.userId.firstName} {child.userId.lastName}
              </h1>
              <p className="text-gold mt-1">Grade {child.grade} • {child.classes.length} Classes</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-3xl font-bold text-maroon mt-1">
              {averageScore.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {completedAssignments.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-gold mt-1">
              {pendingAssignments.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Progress Reports</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {reports.length}
            </p>
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
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'reports' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Progress Reports
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-maroon mb-4">Enrolled Classes</h3>
                  {child.classes.length === 0 ? (
                    <p className="text-gray-500">No classes enrolled</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {child.classes.map((classItem) => (
                        <div key={classItem._id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-maroon">{classItem.subject.name}</h4>
                          <p className="text-sm text-gray-600">{classItem.subject.level}</p>
                          <p className="text-sm text-gray-600 mt-2">
                            Tutor: {classItem.tutor.userId.firstName} {classItem.tutor.userId.lastName}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-maroon mb-4">Performance Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Overall Average</p>
                        <div className="flex items-center gap-3">
                          <div className="text-4xl font-bold text-maroon">
                            {averageScore.toFixed(1)}%
                          </div>
                          {averageScore >= 80 && <span className="text-3xl">🌟</span>}
                          {averageScore >= 60 && averageScore < 80 && <span className="text-3xl">👍</span>}
                          {averageScore < 60 && averageScore > 0 && <span className="text-3xl">📚</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
                        <div className="text-4xl font-bold text-green-600">
                          {assignments.length > 0 
                            ? ((completedAssignments.length / assignments.length) * 100).toFixed(0) 
                            : 0}%
                        </div>
                      </div>
                    </div>

                    {gradedAssignments.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Score Distribution</p>
                        <div className="space-y-2">
                          {['A (90-100%)', 'B (80-89%)', 'C (70-79%)', 'D (60-69%)', 'F (<60%)'].map((grade, idx) => {
                            const range = [
                              [90, 100],
                              [80, 89],
                              [70, 79],
                              [60, 69],
                              [0, 59]
                            ][idx];
                            const count = gradedAssignments.filter(a => {
                              const score = (a.submission!.score / a.totalPoints) * 100;
                              return score >= range[0] && score <= range[1];
                            }).length;
                            const percentage = (count / gradedAssignments.length) * 100;

                            return (
                              <div key={grade} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 w-24">{grade}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-4">
                                  <div 
                                    className="bg-maroon h-4 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-12">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div>
                <h3 className="text-xl font-bold text-maroon mb-6">Assignment History</h3>
                
                {assignments.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">No assignments yet</p>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-lg">{assignment.title}</h4>
                            <p className="text-sm text-gray-600">{assignment.class.subject.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            {assignment.submission ? (
                              assignment.submission.score !== undefined ? (
                                <div>
                                  <div className="text-2xl font-bold text-green-600">
                                    {assignment.submission.score}/{assignment.totalPoints}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {((assignment.submission.score / assignment.totalPoints) * 100).toFixed(0)}%
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-blue-600 font-semibold">
                                  Awaiting Grade
                                </span>
                              )
                            ) : (
                              <span className="text-sm text-gold font-semibold">
                                Not Submitted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h3 className="text-xl font-bold text-maroon mb-6">Progress Reports</h3>
                
                {reports.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">No progress reports yet</p>
                ) : (
                  <div className="space-y-6">
                    {reports.map((report) => (
                      <div key={report._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-maroon">
                              {report.class.subject.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Overall Grade</p>
                            <p className="text-3xl font-bold text-maroon">{report.overallGrade}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Attendance</p>
                            <p className="text-2xl font-bold text-blue-600">{report.attendance}%</p>
                          </div>
                        </div>

                        {report.strengths.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-green-700 mb-2">✓ Strengths:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {report.strengths.map((strength, idx) => (
                                <li key={idx} className="text-sm text-gray-700">{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {report.areasForImprovement.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-orange-700 mb-2">📈 Areas for Improvement:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {report.areasForImprovement.map((area, idx) => (
                                <li key={idx} className="text-sm text-gray-700">{area}</li>
                              ))}
                            </ul>
                          </div>
                        )}

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
