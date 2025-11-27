'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subject {
  _id: string;
  name: string;
  level: string;
}

interface Class {
  _id: string;
  subject: Subject;
  description: string;
  tutor: {
    userId: {
      firstName: string;
      lastName: string;
    };
    rating: number;
    totalReviews: number;
  };
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  pricePerMonth: number;
  maxStudents: number;
  students: string[];
  status: string;
}

interface Child {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  grade: string;
}

export default function EnrollClassPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [child, setChild] = useState<Child | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchChildAndClasses();
  }, [params.id]);

  useEffect(() => {
    filterClasses();
  }, [searchTerm, selectedSubject, classes]);

  const fetchChildAndClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch child details
      const childRes = await fetch(`${apiBase}/students/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const childJson = await childRes.json();
      const childData = childJson.data || childJson;
      setChild(childData as Child);

      // Fetch available classes
      const classesRes = await fetch(`${apiBase}/classes?status=active`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const classesJson = await classesRes.json();
      const classesData = classesJson.data || classesJson || [];
      setClasses(Array.isArray(classesData) ? classesData : []);
      setFilteredClasses(Array.isArray(classesData) ? classesData : []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = Array.isArray(classes) ? [...classes] : [];

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tutor.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tutor.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(c => c.subject.name === selectedSubject);
    }

    setFilteredClasses(filtered);
  };

  const uniqueSubjects = Array.isArray(classes)
    ? Array.from(new Set(classes.map(c => c.subject?.name || '')))
    : [];

  const handleEnroll = async () => {
    if (!selectedClass || !child) return;

    // Check wallet balance (simplified - would need actual parent wallet check)
    if (!confirm(`Enroll ${child.userId.firstName} in ${selectedClass.subject.name}? This will cost ₦${selectedClass.pricePerMonth}/month.`)) {
      return;
    }

    setEnrolling(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/classes/${selectedClass._id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: params.id
        })
      });

      if (response.ok) {
        alert('Enrollment successful!');
        router.push('/parent/dashboard');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Enrollment failed');
      }
    } catch (error: any) {
      console.error('Error enrolling:', error);
      alert(error.message || 'Failed to enroll');
      setEnrolling(false);
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

  const childFirst = child.userId?.firstName || 'Child';
  const childLast = child.userId?.lastName || '';

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link href="/parent/dashboard" className="text-gold hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Enroll in Class</h1>
          <p className="text-gold mt-1">
            Enrolling: {childFirst} {childLast} (Grade {child.grade})
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-maroon mb-4">Find Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by subject or tutor name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Classes */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-maroon mb-6">
              Available Classes ({filteredClasses.length})
            </h2>

            {filteredClasses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500">No classes found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClasses.map((classItem) => (
                  <div 
                    key={classItem._id}
                    className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
                      selectedClass?._id === classItem._id 
                        ? 'ring-4 ring-maroon' 
                        : 'hover:shadow-xl'
                    }`}
                    onClick={() => setSelectedClass(classItem)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-maroon">
                          {classItem.subject.name}
                        </h3>
                        <p className="text-sm text-gray-600">{classItem.subject.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ₦{classItem.pricePerMonth.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{classItem.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Tutor:</p>
                        <p className="font-semibold text-gray-800">
                          {classItem.tutor.userId.firstName} {classItem.tutor.userId.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          ⭐ {classItem.tutor.rating.toFixed(1)} ({classItem.tutor.totalReviews} reviews)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Capacity:</p>
                        <p className="font-semibold text-gray-800">
                          {classItem.students.length}/{classItem.maxStudents} students
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Schedule:</p>
                      {classItem.schedule.map((slot, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          📅 {slot.day}: {slot.startTime} - {slot.endTime}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrollment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-maroon mb-4">Enrollment Summary</h3>

              {!selectedClass ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select a class to enroll</p>
                </div>
              ) : (
                <div>
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Student</p>
                    <p className="font-semibold text-gray-800">
                      {child.userId.firstName} {child.userId.lastName}
                    </p>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-semibold text-gray-800">{selectedClass.subject.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedClass.subject.level}</p>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Tutor</p>
                    <p className="font-semibold text-gray-800">
                      {selectedClass.tutor.userId.firstName} {selectedClass.tutor.userId.lastName}
                    </p>
                  </div>

                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Fee</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₦{selectedClass.pricePerMonth.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling || selectedClass.students.length >= selectedClass.maxStudents}
                    className="w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling 
                      ? 'Enrolling...' 
                      : selectedClass.students.length >= selectedClass.maxStudents
                      ? 'Class Full'
                      : 'Confirm Enrollment'}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Payment will be deducted from your wallet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
