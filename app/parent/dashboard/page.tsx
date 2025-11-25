'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface ParentData {
  id: string;
  parentCode: string;
  userId: {
    profile: {
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
  };
  children: Array<{
    studentId: {
      _id: string;
      studentCode: string;
      userId: {
        profile: {
          firstName: string;
          lastName: string;
        };
      };
      academicInfo: {
        currentGrade: string;
        curriculum: string;
      };
      performance: {
        overallPercentage: number;
        attendance: number;
      };
      enrolledSubjects: any[];
    };
    relationship: string;
  }>;
  wallet: {
    balance: number;
    currency: string;
  };
  totalSpent: number;
}

export default function ParentDashboard() {
  const router = useRouter();
  const [parent, setParent] = useState<ParentData | null>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current user
      const userRes = await api.get('/auth/profile');
      const userId = userRes.data.data.id;

      // Get parent profile
      const parentRes = await api.get(`/parents/user/${userId}`);
      const parentData = parentRes.data.data;
      setParent(parentData);

      // Get recent payments
      const paymentsRes = await api.get(`/payments/parent/${parentData.id}`);
      setRecentPayments(paymentsRes.data.data.slice(0, 5));

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

  if (!parent) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No parent profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#C9A05C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {parent.userId.profile.profilePicture ? (
                <img
                  src={parent.userId.profile.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-[#C9A05C]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#C9A05C] flex items-center justify-center text-white font-semibold">
                  {parent.userId.profile.firstName[0]}
                  {parent.userId.profile.lastName[0]}
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome back, {parent.userId.profile.firstName}!
                </h1>
                <p className="text-sm text-gray-600">
                  Parent Portal • {parent.parentCode}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/parent/profile')}
              className="px-4 py-2 text-sm border border-[#C9A05C] text-[#C9A05C] rounded-lg hover:bg-[#C9A05C] hover:text-white transition"
            >
              View Profile
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Children</p>
                <p className="text-3xl font-bold text-[#C9A05C] mt-1">
                  {parent.children.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#C9A05C]/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ₦{parent.wallet.balance.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  ₦{parent.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Classes</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {parent.children.reduce((total, child) => 
                    total + (child.studentId.enrolledSubjects?.filter(s => s.status === 'active').length || 0), 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Children Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Children */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Children</h2>
                <button
                  onClick={() => router.push('/parent/children/add')}
                  className="px-4 py-2 bg-[#C9A05C] text-white rounded-lg hover:bg-[#C9A05C]/90 transition text-sm"
                >
                  + Add Child
                </button>
              </div>
              <div className="p-6">
                {parent.children.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No children added yet</p>
                    <button
                      onClick={() => router.push('/parent/children/add')}
                      className="mt-4 px-4 py-2 bg-[#C9A05C] text-white rounded-lg hover:bg-[#C9A05C]/90 transition text-sm"
                    >
                      Add Your First Child
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {parent.children.map((child) => (
                      <div
                        key={child.studentId._id}
                        className="p-6 bg-[#F5F0E8] rounded-xl hover:shadow-md transition cursor-pointer"
                        onClick={() => router.push(`/parent/children/${child.studentId._id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-[#C9A05C] rounded-full flex items-center justify-center text-white font-semibold text-xl">
                              {child.studentId.userId.profile.firstName[0]}
                              {child.studentId.userId.profile.lastName[0]}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {child.studentId.userId.profile.firstName}{' '}
                                {child.studentId.userId.profile.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {child.studentId.academicInfo.currentGrade} •{' '}
                                {child.studentId.academicInfo.curriculum} Curriculum
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Code: {child.studentId.studentCode}
                              </p>
                              <div className="flex items-center space-x-4 mt-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">Performance:</span>
                                  <span className="px-2 py-1 bg-[#C9A05C] text-white text-xs rounded">
                                    {child.studentId.performance.overallPercentage.toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">Attendance:</span>
                                  <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                                    {child.studentId.performance.attendance.toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="text-[#C9A05C]">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                <button
                  onClick={() => router.push('/parent/payments')}
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
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.paymentType.replace('-', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ref: {payment.paymentCode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₦{payment.amount.toLocaleString()}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              payment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
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

          {/* Right Column - Quick Actions & Wallet */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/parent/enroll')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#8B1538] text-white rounded-lg hover:bg-[#8B1538]/90 transition"
                >
                  <span className="text-2xl">➕</span>
                  <span className="font-medium">Enroll in Subject</span>
                </button>
                <button
                  onClick={() => router.push('/parent/payments/add')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">💳</span>
                  <span className="font-medium text-gray-900">Make Payment</span>
                </button>
                <button
                  onClick={() => router.push('/parent/wallet/topup')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">💰</span>
                  <span className="font-medium text-gray-900">Top Up Wallet</span>
                </button>
                <button
                  onClick={() => router.push('/parent/reports')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">📊</span>
                  <span className="font-medium text-gray-900">View Reports</span>
                </button>
                <button
                  onClick={() => router.push('/parent/messages')}
                  className="w-full flex items-center space-x-3 p-3 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition"
                >
                  <span className="text-2xl">💬</span>
                  <span className="font-medium text-gray-900">Messages</span>
                </button>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-[#C9A05C] to-[#8B1538] rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Wallet</h3>
                <span className="text-2xl">💳</span>
              </div>
              <div className="mb-6">
                <p className="text-sm opacity-90">Current Balance</p>
                <p className="text-3xl font-bold mt-1">
                  ₦{parent.wallet.balance.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push('/parent/wallet/topup')}
                  className="flex-1 bg-white text-[#C9A05C] py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  Top Up
                </button>
                <button
                  onClick={() => router.push('/parent/wallet/transactions')}
                  className="flex-1 bg-white/10 backdrop-blur py-2 rounded-lg font-medium hover:bg-white/20 transition"
                >
                  History
                </button>
              </div>
            </div>

            {/* Need Help? */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to assist you with any questions.
              </p>
              <button
                onClick={() => router.push('/parent/support')}
                className="w-full px-4 py-2 border border-[#C9A05C] text-[#C9A05C] rounded-lg hover:bg-[#C9A05C] hover:text-white transition text-sm font-medium"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
