'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

export default function TutorStage6Page() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [status, setStatus] = useState<StageStatus>('pending');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTutor = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          router.push('/login');
          return;
        }

        const res = await fetch(`${apiBase}/tutors/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        const data = json.data || json;
        if (!res.ok || !data?._id) throw new Error(json.message || 'Unable to load tutor profile');

        setTutorId(data._id);
        const stage = data.verificationStages?.stage6_introductoryCall;
        if (stage) {
          setStatus(stage.status || 'pending');
          if (stage.scheduledDate) setScheduledDate(new Date(stage.scheduledDate).toISOString().slice(0, 16));
          if (stage.notes) setNotes(stage.notes);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load verification data');
      }
    };
    loadTutor();
  }, [apiBase, router]);

  const handleSubmit = async () => {
    try {
      setError('');
      setMessage('');
      if (!tutorId) throw new Error('Tutor profile not found');
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      if (!scheduledDate) throw new Error('Please pick a date/time for the introductory call.');

      setSubmitting(true);
      const res = await fetch(`${apiBase}/tutors/${tutorId}/verification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stage: 'stage6_introductoryCall',
          status: 'scheduled',
          data: {
            scheduledDate: new Date(scheduledDate),
            notes: notes.trim() || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to schedule call');
      const newStatus = json.data?.verificationStages?.stage6_introductoryCall?.status || 'scheduled';
      setStatus(newStatus);
      setMessage('Introductory call scheduled.');
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Stage 6: Introductory Call</h1>
            <p className="text-gold mt-1">Schedule your onboarding call.</p>
          </div>
          <button
            onClick={() => router.push('/tutor/verification')}
            className="bg-white text-maroon px-4 py-2 rounded-lg font-semibold hover:bg-gold hover:text-white transition-colors"
          >
            Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-maroon">What to schedule</h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
              Status: {status}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>Pick a time for your onboarding/introductory call.</li>
            <li>Be ready to discuss your teaching approach and resolve any outstanding questions.</li>
            <li>We will confirm or reschedule if needed.</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred date & time</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                rows={3}
                placeholder="Share time zone, alternative slots, or preferences."
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`bg-maroon text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-900 transition-colors ${
                submitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Scheduling…' : 'Schedule call'}
            </button>
            <button
              onClick={() => router.push('/tutor/verification')}
              className="bg-white text-maroon border border-maroon px-5 py-2 rounded-lg font-semibold hover:bg-maroon hover:text-white transition-colors"
            >
              Back to stages
            </button>
          </div>
          {message && <p className="text-green-700 text-sm font-semibold">{message}</p>}
          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
          {status === 'approved' && (
            <div className="pt-2">
              <button
                onClick={() => router.push('/tutor/verification/stage7')}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue to Stage 7
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
