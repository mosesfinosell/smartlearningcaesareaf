'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Tutor {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  subjects: Array<{
    name: string;
    level: string;
  }>;
  qualifications: string[];
  verificationStage: number;
  verificationStatus: string;
  cvUrl?: string;
  certificatesUrl?: string[];
  idCardUrl?: string;
  interviewScheduled?: Date;
  trialClassScheduled?: Date;
  createdAt: Date;
}

interface Stats {
  totalTutors: number;
  pendingVerification: number;
  activeTutors: number;
  totalStudents: number;
  totalClasses: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [stats, setStats] = useState<Stats>({
    totalTutors: 0,
    pendingVerification: 0,
    activeTutors: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalRevenue: 0
  });
  const [pendingTutors, setPendingTutors] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch stats
      const statsRes = await fetch(`${apiBase}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch pending tutors
      const tutorsRes = await fetch(`${apiBase}/tutors?verificationStatus=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tutorsData = await tutorsRes.json();
      setPendingTutors(tutorsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleVerificationAction = async (tutorId: string, action: string, stage?: number) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/tutors/${tutorId}/verification`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          stage,
          comments: action === 'reject' ? 'Requirements not met' : undefined
        })
      });

      if (response.ok) {
        alert(`Tutor ${action}ed successfully!`);
        setSelectedTutor(null);
        fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getStageLabel = (stage: number) => {
    const stages = [
      'Application Submitted',
      'Documents Verified',
      'Interview Scheduled',
      'Interview Completed',
      'Trial Class Scheduled',
      'Trial Class Completed',
      'Approved'
    ];
    return stages[stage - 1] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-2xl text-maroon">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">SmartLearning by Caesarea College - Admin Dashboard</h1>
          <p className="text-gold mt-2">Manage tutors, students, and system operations</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <StatCard 
            title="Total Tutors" 
            value={stats.totalTutors} 
            color="bg-maroon"
          />
          <StatCard 
            title="Pending Verification" 
            value={stats.pendingVerification} 
            color="bg-gold"
          />
          <StatCard 
            title="Active Tutors" 
            value={stats.activeTutors} 
            color="bg-green-600"
          />
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            color="bg-blue-600"
          />
          <StatCard 
            title="Total Classes" 
            value={stats.totalClasses} 
            color="bg-purple-600"
          />
          <StatCard 
            title="Revenue (₦)" 
            value={stats.totalRevenue.toLocaleString()} 
            color="bg-green-700"
          />
        </div>

        {/* Pending Tutors Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-maroon mb-6">
            Pending Tutor Verifications ({pendingTutors.length})
          </h2>

          {pendingTutors.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending verifications</p>
          ) : (
            <div className="space-y-4">
              {pendingTutors.map((tutor) => (
                <div 
                  key={tutor._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTutor(tutor)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-maroon">
                        {tutor.userId.firstName} {tutor.userId.lastName}
                      </h3>
                      <p className="text-gray-600">{tutor.userId.email}</p>
                      <p className="text-gray-600">{tutor.userId.phoneNumber}</p>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Subjects: </span>
                        <span className="text-sm text-gray-700">
                          {tutor.subjects.map(s => `${s.name} (${s.level})`).join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        tutor.verificationStage < 3 ? 'bg-yellow-100 text-yellow-800' :
                        tutor.verificationStage < 5 ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        Stage {tutor.verificationStage}: {getStageLabel(tutor.verificationStage)}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        Applied: {new Date(tutor.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tutor Detail Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-maroon text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedTutor.userId.firstName} {selectedTutor.userId.lastName}
              </h2>
              <button 
                onClick={() => setSelectedTutor(null)}
                className="text-white hover:text-gold text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-maroon mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{selectedTutor.userId.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{selectedTutor.userId.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-maroon mb-3">Subjects & Levels</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTutor.subjects.map((subject, idx) => (
                    <span key={idx} className="bg-gold text-white px-3 py-1 rounded-full text-sm">
                      {subject.name} - {subject.level}
                    </span>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-maroon mb-3">Qualifications</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTutor.qualifications.map((qual, idx) => (
                    <li key={idx} className="text-gray-700">{qual}</li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-maroon mb-3">Documents</h3>
                <div className="space-y-2">
                  {selectedTutor.cvUrl && (
                    <a
                      href={selectedTutor.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="block text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <i className="fa-regular fa-file-lines" aria-hidden="true" />
                      <span>View CV/Resume</span>
                    </a>
                  )}
                  {selectedTutor.certificatesUrl && selectedTutor.certificatesUrl.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Certificates:</p>
                      {selectedTutor.certificatesUrl.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline ml-4 flex items-center gap-2"
                        >
                          <i className="fa-solid fa-award" aria-hidden="true" />
                          <span>Certificate {idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {selectedTutor.idCardUrl && (
                    <a
                      href={selectedTutor.idCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <i className="fa-regular fa-id-card" aria-hidden="true" />
                      <span>View ID Card</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Current Stage */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-maroon mb-3">Verification Progress</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg">
                    <span className="font-semibold">Current Stage:</span> {selectedTutor.verificationStage}
                  </p>
                  <p className="text-gray-700">{getStageLabel(selectedTutor.verificationStage)}</p>
                  {selectedTutor.interviewScheduled && (
                    <p className="text-sm text-gray-600 mt-2">
                      Interview: {new Date(selectedTutor.interviewScheduled).toLocaleString()}
                    </p>
                  )}
                  {selectedTutor.trialClassScheduled && (
                    <p className="text-sm text-gray-600 mt-2">
                      Trial Class: {new Date(selectedTutor.trialClassScheduled).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {selectedTutor.verificationStage < 7 && (
                  <button
                    onClick={() => handleVerificationAction(
                      selectedTutor._id, 
                      'approve', 
                      selectedTutor.verificationStage + 1
                    )}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : `Move to Stage ${selectedTutor.verificationStage + 1}`}
                  </button>
                )}
                
                <button
                  onClick={() => handleVerificationAction(selectedTutor._id, 'reject')}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className={`${color} text-white rounded-lg p-4 shadow-lg`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
