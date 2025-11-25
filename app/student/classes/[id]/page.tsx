'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

export default function StudentClassDetails() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id;
  
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const res = await api.get(`/classes/${classId}`);
      setClassData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching class:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A05C]"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="text-gray-600">Class not found</p>
      </div>
    );
  }

  const nextSession = classData.sessions?.find((s: any) => s.status === 'scheduled');
  const completedSessions = classData.sessions?.filter((s: any) => s.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Classes
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {classData.subjectId?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                {classData.classCode} • {classData.type === 'one-on-one' ? '1-on-1' : 'Group'} Class
              </p>
            </div>
            {nextSession?.zoomMeetingLink && (
              <a
                href={nextSession.zoomMeetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#0E72ED] text-white rounded-lg hover:bg-[#0E72ED]/90 transition font-medium"
              >
                Join Next Class
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Tutor</p>
                  <p className="text-lg font-medium text-gray-900">
                    {classData.tutorId?.profile?.firstName} {classData.tutorId?.profile?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Schedule</p>
                  <p className="text-lg font-medium text-gray-900">
                    {classData.schedule?.day}s, {classData.schedule?.startTime} - {classData.schedule?.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-900">{classData.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enrolled Students</p>
                  <p className="text-lg font-medium text-gray-900">
                    {classData.currentEnrollment} / {classData.maxCapacity}
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Session */}
            {nextSession && (
              <div className="bg-gradient-to-br from-[#C9A05C] to-[#8B1538] rounded-xl shadow-lg p-6 text-white">
                <h2 className="text-xl font-semibold mb-4">Next Session</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Date</span>
                    <span className="font-medium">
                      {new Date(nextSession.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time</span>
                    <span className="font-medium">
                      {classData.schedule?.startTime} - {classData.schedule?.endTime}
                    </span>
                  </div>
                  {nextSession.topic && (
                    <div className="flex items-center justify-between">
                      <span>Topic</span>
                      <span className="font-medium">{nextSession.topic}</span>
                    </div>
                  )}
                  {nextSession.zoomMeetingLink && (
                    <a
                      href={nextSession.zoomMeetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full bg-white text-[#C9A05C] py-3 rounded-lg font-medium hover:bg-gray-100 transition text-center block"
                    >
                      Join via Zoom
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Session History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Session History ({completedSessions.length})
              </h2>
              {completedSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No completed sessions yet</p>
              ) : (
                <div className="space-y-3">
                  {completedSessions.map((session: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{session.topic || 'Session'}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      {session.recordingLink && (
                        <a
                          href={session.recordingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#C9A05C] hover:underline"
                        >
                          View Recording
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sessions Attended</span>
                  <span className="font-semibold text-gray-900">
                    {completedSessions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attendance Rate</span>
                  <span className="font-semibold text-green-600">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Grade</span>
                  <span className="font-semibold text-[#C9A05C]">A</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`/student/assignments?class=${classId}`)}
                  className="w-full px-4 py-2 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition text-left"
                >
                  📝 View Assignments
                </button>
                <button
                  onClick={() => router.push(`/student/messages?tutor=${classData.tutorId?._id}`)}
                  className="w-full px-4 py-2 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition text-left"
                >
                  💬 Message Tutor
                </button>
                <button
                  className="w-full px-4 py-2 bg-[#F5F0E8] rounded-lg hover:bg-[#C9A05C]/10 transition text-left"
                >
                  📊 View Progress
                </button>
              </div>
            </div>

            {/* Calendar Link */}
            {nextSession?.calendarLink && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Add to Calendar</h3>
                <a
                  href={nextSession.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 border border-[#C9A05C] text-[#C9A05C] rounded-lg hover:bg-[#C9A05C] hover:text-white transition text-center block"
                >
                  📅 Add to Google Calendar
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
