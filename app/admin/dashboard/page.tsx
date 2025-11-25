'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalParents: 0,
    totalTutors: 0,
    verifiedTutors: 0,
    pendingTutors: 0,
    totalClasses: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, parentsRes, tutorsRes, classesRes, paymentsRes] = await Promise.all([
        api.get('/students'),
        api.get('/parents'),
        api.get('/tutors'),
        api.get('/classes'),
        api.get('/payments'),
      ]);

      const students = studentsRes.data.data;
      const parents = parentsRes.data.data;
      const tutors = tutorsRes.data.data;
      const classes = classesRes.data.data;
      const payments = paymentsRes.data.data;

      setStats({
        totalUsers: students.length + parents.length + tutors.length,
        totalStudents: students.length,
        totalParents: parents.length,
        totalTutors: tutors.length,
        verifiedTutors: tutors.filter((t: any) => t.overallVerificationStatus === 'verified').length,
        pendingTutors: tutors.filter((t: any) => 
          t.overallVerificationStatus === 'pending' || t.overallVerificationStatus === 'in-progress'
        ).length,
        totalClasses: classes.length,
        totalRevenue: payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.amount, 0),
        pendingPayments: payments.filter((p: any) => p.status === 'pending').length,
      });

      const allUsers = [
        ...students.map((s: any) => ({ ...s, type: 'Student' })),
        ...parents.map((p: any) => ({ ...p, type: 'Parent' })),
        ...tutors.map((t: any) => ({ ...t, type: 'Tutor' })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentUsers(allUsers.slice(0, 5));

      const pending = tutors.filter((t: any) => 
        t.overallVerificationStatus === 'pending' || t.overallVerificationStatus === 'in-progress'
      );
      setPendingVerifications(pending.slice(0, 5));

      setRecentPayments(payments.slice(0, 5));

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
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <header className="bg-white shadow-sm border-b border-[#C9A05C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Caesarea Smart School Platform Management</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/admin/settings')}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => router.push('/admin/reports')}
                className="px-4 py-2 text-sm bg-[#C9A05C] text-white rounded-lg hover:bg-[#C9A05C]/90 transition"
              >
                📊 Reports
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm">
              <span className="text-blue-600">{stats.totalStudents} students</span>
              <span className="text-green-600">{stats.totalParents} parents</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Tutors</h3>
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTutors}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm">
              <span className="text-green-600">✓ {stats.verifiedTutors} verified</span>
              <span className="text-yellow-600">⏳ {stats.pendingTutors} pending</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₦{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-3">
              {stats.pendingPayments} pending payments
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Active Classes</h3>
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
            <button
              onClick={() => router.push('/admin/classes')}
              className="text-sm text-[#C9A05C] hover:underline mt-3"
            >
              View all classes →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Pending Tutor Verifications</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.pendingTutors} tutors awaiting verification
                  </p>
                </div>
                <button
                  onClick={() => router.push('/admin/tutors/pending')}
                  className="text-sm text-[#C9A05C] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="p-6">
                {pendingVerifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No pending verifications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingVerifications.map((tutor) => (
                      <div
                        key={tutor._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#C9A05C] transition cursor-pointer"
                        onClick={() => router.push(`/admin/tutors/${tutor._id}/verify`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#C9A05C]/10 rounded-full flex items-center justify-center">
                            <span className="text-[#C9A05C] font-semibold">
                              {tutor.userId?.profile?.firstName?.[0] || 'T'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {tutor.userId?.profile?.firstName || 'Unknown'} {tutor.userId?.profile?.lastName || ''}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Code: {tutor.tutorCode}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Review
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                <button
                  onClick={() => router.push('/admin/payments')}
                  className="text-sm text-[#C9A05C] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="p-6">
                {recentPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPayments.map((payment) => (
                      <div
                        key={payment._id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.paymentType?.replace('-', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₦{payment.amount.toLocaleString()}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
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
                  onClick={() => router.push('/admin/users')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">👥</span>
                  <span className="font-medium text-gray-900">Manage Users</span>
                </button>
                <button
                  onClick={() => router.push('/admin/tutors/pending')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">✅</span>
                  <span className="font-medium text-gray-900">Verify Tutors</span>
                </button>
                <button
                  onClick={() => router.push('/admin/subjects')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">📚</span>
                  <span className="font-medium text-gray-900">Manage Subjects</span>
                </button>
                <button
                  onClick={() => router.push('/admin/payments')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">💳</span>
                  <span className="font-medium text-gray-900">View Payments</span>
                </button>
                <button
                  onClick={() => router.push('/admin/analytics')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">📊</span>
                  <span className="font-medium text-gray-900">Analytics</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Registrations</h3>
              {recentUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No recent users</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="w-8 h-8 bg-[#C9A05C]/10 rounded-full flex items-center justify-center text-xs font-semibold text-[#C9A05C]">
                        {user.userId?.profile?.firstName?.[0] || user.type[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.userId?.profile?.firstName || 'User'} {user.userId?.profile?.lastName || ''}
                        </p>
                        <p className="text-xs text-gray-600">{user.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payments</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notifications</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
