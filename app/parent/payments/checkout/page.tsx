'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function PaymentCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'wallet-topup';
  
  const [parent, setParent] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState(type);
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await api.get('/auth/profile');
      const userId = userRes.data.data.id;
      
      const parentRes = await api.get(`/parents/user/${userId}`);
      setParent(parentRes.data.data);

      const subjectsRes = await api.get('/subjects');
      setSubjects(subjectsRes.data.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (paymentType === 'subject-fee' && (!selectedChild || !selectedSubject)) {
      alert('Please select a child and subject');
      return;
    }

    try {
      setProcessing(true);

      const userRes = await api.get('/auth/profile');
      const email = userRes.data.data.email;

      const paymentData: any = {
        email,
        amount: parseFloat(amount) * 100, // Convert to kobo
        paymentType,
      };

      if (paymentType === 'subject-fee') {
        paymentData.items = [{
          studentId: selectedChild,
          subjectId: selectedSubject,
          quantity: 1,
          unitPrice: parseFloat(amount),
        }];
      }

      const res = await api.post('/payments/initialize', paymentData);
      const { authorizationUrl } = res.data.data;

      // Redirect to Paystack
      window.location.href = authorizationUrl;
    } catch (error: any) {
      console.error('Error initializing payment:', error);
      alert(error.response?.data?.message || 'Failed to initialize payment');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A05C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Checkout</h1>

          {/* Payment Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentType('wallet-topup')}
                className={`p-4 rounded-lg border-2 transition ${
                  paymentType === 'wallet-topup'
                    ? 'border-[#C9A05C] bg-[#C9A05C]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">💰</div>
                <div className="font-medium text-gray-900">Wallet Top-up</div>
                <div className="text-sm text-gray-600">Add funds to your wallet</div>
              </button>
              <button
                onClick={() => setPaymentType('subject-fee')}
                className={`p-4 rounded-lg border-2 transition ${
                  paymentType === 'subject-fee'
                    ? 'border-[#C9A05C] bg-[#C9A05C]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-medium text-gray-900">Subject Fee</div>
                <div className="text-sm text-gray-600">Pay for a subject</div>
              </button>
            </div>
          </div>

          {/* Child and Subject Selection (for subject fee) */}
          {paymentType === 'subject-fee' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Child
                </label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A05C] focus:border-transparent"
                >
                  <option value="">Choose a child...</option>
                  {parent?.children?.map((child: any) => (
                    <option key={child.studentId._id} value={child.studentId._id}>
                      {child.studentId.userId.profile.firstName} {child.studentId.userId.profile.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    const subject = subjects.find(s => s._id === e.target.value);
                    if (subject) {
                      setAmount(subject.pricing.basePrice.toString());
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A05C] focus:border-transparent"
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} - ₦{subject.pricing.basePrice.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={paymentType === 'subject-fee' && !!selectedSubject}
              placeholder="Enter amount"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A05C] focus:border-transparent disabled:bg-gray-50"
            />
            {paymentType === 'wallet-topup' && (
              <div className="flex space-x-2 mt-3">
                {[5000, 10000, 20000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="px-4 py-2 bg-[#F5F0E8] text-gray-700 rounded-lg hover:bg-[#C9A05C]/10 transition text-sm"
                  >
                    ₦{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Wallet Balance */}
          <div className="mb-6 p-4 bg-[#F5F0E8] rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Current Wallet Balance</span>
              <span className="text-xl font-bold text-[#C9A05C]">
                ₦{parent?.wallet?.balance?.toLocaleString() || 0}
              </span>
            </div>
            {paymentType === 'wallet-topup' && amount && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#C9A05C]/20">
                <span className="text-gray-700">New Balance After Top-up</span>
                <span className="text-xl font-bold text-green-600">
                  ₦{((parent?.wallet?.balance || 0) + parseFloat(amount || '0')).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="mb-6 p-6 bg-gradient-to-br from-[#C9A05C]/10 to-[#8B1538]/10 rounded-lg border border-[#C9A05C]/20">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Type</span>
                <span className="font-medium text-gray-900">
                  {paymentType === 'wallet-topup' ? 'Wallet Top-up' : 'Subject Fee'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Amount</span>
                <span className="font-medium text-gray-900">
                  ₦{parseFloat(amount || '0').toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#C9A05C]/20">
                <span className="font-semibold text-gray-900">Total to Pay</span>
                <span className="text-xl font-bold text-[#C9A05C]">
                  ₦{parseFloat(amount || '0').toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing || !amount || parseFloat(amount) <= 0}
            className="w-full py-4 bg-[#8B1538] text-white rounded-lg hover:bg-[#8B1538]/90 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ₦${parseFloat(amount || '0').toLocaleString()} with Paystack`
            )}
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            🔒 Secure payment powered by Paystack
          </p>
        </div>
      </div>
    </div>
  );
}
