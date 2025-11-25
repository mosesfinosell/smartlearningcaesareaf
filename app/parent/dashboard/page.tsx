'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Child {
  _id: string;
  userId: any;
  grade?: string;
  classes?: any[];
}

interface Payment {
  _id: string;
  amount: number;
  type: string;
  status: string;
  class?: any;
  student?: any;
  createdAt: Date;
}

interface Message {
  _id: string;
  content: string;
  sender?: any;
  recipient?: any;
  tutor?: any;
  student?: any;
  createdAt: Date;
  read: boolean;
}

interface ParentProfile {
  _id: string;
  userId: any;
  children: any[];
  wallet?: {
    balance?: number;
  };
}

export default function ParentDashboard() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'children' | 'payments' | 'messages'>('children');
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [error, setError] = useState('');

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

      // Fetch parent profile
      const profileRes = await fetch(`${apiBase}/parents/user/${userId}`, {
        headers: authHeaders
      });
      const profileJson = await profileRes.json();
      const profileData = profileJson.data || profileJson;
      if (!profileRes.ok || !profileData) {
        throw new Error(profileJson.message || 'Failed to load profile');
      }
      setProfile(profileData as ParentProfile);

      // Children: try embedded first, otherwise fetch from /parents/children
      let parentChildren = Array.isArray(profileData.children) ? profileData.children : [];
      if (!parentChildren.length && profileData._id) {
        const childrenRes = await fetch(`${apiBase}/parents/children`, {
          headers: authHeaders
        });
        const childrenJson = await childrenRes.json();
        parentChildren = (childrenJson.data || childrenJson || []) as Child[];
      }
      setChildren(parentChildren);

      // Fetch payments for this parent
      if (profileData._id) {
        const paymentsRes = await fetch(`${apiBase}/payments/parent/${profileData._id}`, {
          headers: authHeaders
        });
        const paymentsJson = await paymentsRes.json();
        setPayments((paymentsJson.data || paymentsJson || []) as Payment[]);
      } else {
        setPayments([]);
      }

      // Fetch messages for this user
      const messagesRes = await fetch(`${apiBase}/messages/user/${userId}`, {
        headers: authHeaders
      });
      const messagesJson = await messagesRes.json();
      setMessages((messagesJson.data || messagesJson || []) as Message[]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Could not load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  const handleFundWallet = async () => {
    const amount = prompt('Enter amount to fund (₦):');
    if (!amount || isNaN(Number(amount))) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/payments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          type: 'wallet_funding'
        })
      });

      const data = await response.json();
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to initialize payment');
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

  const safeMessages = Array.isArray(messages) ? messages : [];
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeChildren = Array.isArray(children) ? children : [];
  const unreadMessages = safeMessages.filter(m => !m.read).length;
  const pendingPayments = safePayments.filter(p => p.status === 'pending').length;
  const totalSpent = safePayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const walletBalance = profile.wallet?.balance ?? 0;
  const firstName = profile.userId?.profile?.firstName || profile.userId?.firstName || 'Parent';
  const lastName = profile.userId?.profile?.lastName || profile.userId?.lastName || '';

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Parent Dashboard</h1>
            <p className="text-gold mt-1">Welcome, {firstName} {lastName}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm opacity-90">Wallet Balance</p>
              <p className="text-2xl font-bold">₦{walletBalance.toLocaleString()}</p>
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
            title="Children"
            value={safeChildren.length}
            color="bg-maroon"
            icon="👨‍👩‍👧‍👦"
          />
          <StatCard
            title="Total Classes"
            value={safeChildren.reduce((sum, c) => sum + (c.classes?.length || 0), 0)}
            color="bg-gold"
            icon="📚"
          />
          <StatCard
            title="Unread Messages"
            value={unreadMessages}
            color="bg-blue-600"
            icon="✉️"
          />
          <StatCard
            title="Total Spent"
            value={`₦${totalSpent.toLocaleString()}`}
            color="bg-green-600"
            icon="💰"
          />
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-maroon to-red-900 text-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Wallet Balance</p>
              <p className="text-4xl font-bold mt-1">₦{walletBalance.toLocaleString()}</p>
              {pendingPayments > 0 && (
                <p className="text-sm mt-2 text-gold">
                  ⚠️ {pendingPayments} pending payment{pendingPayments > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button 
              onClick={handleFundWallet}
              className="bg-white text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              + Fund Wallet
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('children')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'children' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              My Children
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'payments' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-4 px-6 font-semibold relative ${
                activeTab === 'messages' 
                  ? 'bg-maroon text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Messages
              {unreadMessages > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
          </div>

          <div className="p-6">
            {/* Children Tab */}
            {activeTab === 'children' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-maroon">My Children</h2>
                  <Link href="/parent/children/add">
                    <button className="bg-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600">
                      + Add Child
                    </button>
                  </Link>
                </div>

                {safeChildren.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No children added yet</p>
                    <p className="text-gray-400 mt-2">Add your first child to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {safeChildren.map((child) => {
                      const childFirst = child.userId?.profile?.firstName || child.userId?.firstName || 'Child';
                      const childLast = child.userId?.profile?.lastName || child.userId?.lastName || '';
                      const childEmail = child.userId?.email || child.userId?.profile?.email || '';
                      return (
                      <div key={child._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {(childFirst || 'C')[0]}
                            {(childLast || '')[0] || ''}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-maroon">
                              {childFirst} {childLast}
                            </h3>
                            <p className="text-gray-600">Grade: {child.grade || 'N/A'}</p>
                            {childEmail && <p className="text-gray-600">{childEmail}</p>}
                          </div>
                          <Link href={`/parent/children/${child._id}/progress`}>
                            <button className="bg-maroon text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-900">
                              View Progress
                            </button>
                          </Link>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Enrolled Classes ({child.classes?.length || 0})
                          </h4>
                          {!child.classes || child.classes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No classes enrolled</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {child.classes.map((classItem) => (
                                <div key={classItem._id} className="bg-gray-50 p-3 rounded-lg">
                                  <p className="font-semibold text-maroon">{classItem.subject.name}</p>
                                  <p className="text-sm text-gray-600">{classItem.subject.level}</p>
                                  <p className="text-sm text-gray-600">
                                    Tutor: {classItem.tutor.userId.firstName} {classItem.tutor.userId.lastName}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-4">
                            <Link href={`/parent/children/${child._id}/enroll`}>
                              <button className="bg-gold text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600">
                                + Enroll in New Class
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-2xl font-bold text-maroon mb-6">Payment History</h2>
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No payments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {payment.class.subject.name} - {payment.student.userId.firstName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {payment.type.replace('_', ' ')} • {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-800">₦{payment.amount.toLocaleString()}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
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
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-2xl font-bold text-maroon mb-6">Messages with Tutors</h2>
                
                {/* Child Filter */}
                <div className="mb-4">
                  <select
                    value={selectedChild || ''}
                    onChange={(e) => setSelectedChild(e.target.value || null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Children</option>
                    {children.map((child) => (
                      <option key={child._id} value={child._id}>
                        {child.userId.firstName} {child.userId.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages
                      .filter(msg => !selectedChild || msg.student._id === selectedChild)
                      .map((message) => (
                        <div key={message._id} className={`border rounded-lg p-4 ${
                          !message.read ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {message.sender.firstName} {message.sender.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Re: {message.student.userId.firstName} • Tutor: {message.tutor.userId.firstName} {message.tutor.userId.lastName}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-gray-700">{message.content}</p>
                          <Link href={`/parent/messages/${message.tutor._id}`}>
                            <button className="mt-3 text-sm text-maroon font-semibold hover:underline">
                              Reply →
                            </button>
                          </Link>
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
