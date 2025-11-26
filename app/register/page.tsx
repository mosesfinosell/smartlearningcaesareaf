'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserRole = 'tutor' | 'student' | 'parent';

export default function RegisterPage() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    // Tutor specific
    subjects: [] as Array<{name: string; level: string}>,
    qualifications: [] as string[],
    // Student specific
    grade: '',
    parentEmail: '',
    // Parent specific
    occupation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user account (backend also creates role profile)
      const userResponse = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: role,
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber
          }
        })
      });

      const raw = await userResponse.json();
      const payload = raw.data || raw;

      if (!userResponse.ok) {
        throw new Error(payload.message || raw.message || 'Registration failed');
      }

      const token = payload.accessToken || payload.token;
      const userId = payload.user?.id || payload.user?._id || payload.userId;
      if (!token || !userId) {
        throw new Error('Invalid registration response');
      }

      // Store token and redirect
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);

      alert('Registration successful!');
      
      // Redirect based on role
      switch (role) {
        case 'tutor':
          router.push('/tutor/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'parent':
          router.push('/parent/dashboard');
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', level: '' }]
    });
  };

  const updateSubject = (index: number, field: 'name' | 'level', value: string) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addQualification = () => {
    const qual = prompt('Enter qualification:');
    if (qual) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, qual]
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-maroon mb-2">Join SmartLearning by Caesarea College</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          {step === 'role' && (
            <div>
              <h2 className="text-2xl font-bold text-maroon mb-6 text-center">
                I am a...
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleRoleSelect('tutor')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-maroon hover:shadow-md transition-all"
                >
                  <div className="text-5xl mb-3">👨‍🏫</div>
                  <h3 className="text-xl font-semibold text-maroon">Tutor</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Teach students and manage classes
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect('student')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-maroon hover:shadow-md transition-all"
                >
                  <div className="text-5xl mb-3">🎓</div>
                  <h3 className="text-xl font-semibold text-maroon">Student</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Learn and complete assignments
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect('parent')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-maroon hover:shadow-md transition-all"
                >
                  <div className="text-5xl mb-3">👨‍👩‍👧</div>
                  <h3 className="text-xl font-semibold text-maroon">Parent</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Monitor children and manage payments
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {step === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-maroon">
                  {role === 'tutor' && '👨‍🏫 Tutor Registration'}
                  {role === 'student' && '🎓 Student Registration'}
                  {role === 'parent' && '👨‍👩‍👧 Parent Registration'}
                </h2>
                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="text-sm text-gray-600 hover:text-maroon"
                >
                  ← Change Role
                </button>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>

              {/* Role-specific fields */}
              {role === 'tutor' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Subjects & Levels *
                      </label>
                      <button
                        type="button"
                        onClick={addSubject}
                        className="text-sm text-maroon hover:underline"
                      >
                        + Add Subject
                      </button>
                    </div>
                    {formData.subjects.map((subject, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Subject name"
                          value={subject.name}
                          onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                        />
                        <select
                          value={subject.level}
                          onChange={(e) => updateSubject(idx, 'level', e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                        >
                          <option value="">Level</option>
                          <option value="Primary">Primary</option>
                          <option value="Secondary">Secondary</option>
                          <option value="A-Level">A-Level</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Qualifications
                      </label>
                      <button
                        type="button"
                        onClick={addQualification}
                        className="text-sm text-maroon hover:underline"
                      >
                        + Add Qualification
                      </button>
                    </div>
                    {formData.qualifications.map((qual, idx) => (
                      <div key={idx} className="text-sm text-gray-700 mb-1">
                        • {qual}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {role === 'student' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grade/Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      placeholder="e.g., Grade 10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Parent Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                      placeholder="parent@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                </div>
              )}

              {role === 'parent' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
              )}

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-maroon font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
