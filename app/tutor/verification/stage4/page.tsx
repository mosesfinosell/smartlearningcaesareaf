'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

export default function TutorStage4Page() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [status, setStatus] = useState<StageStatus>('pending');
  const [backgroundCheckCompleted, setBackgroundCheckCompleted] = useState(false);
  const [backgroundCheckUrl, setBackgroundCheckUrl] = useState('');
  const [policeClearance, setPoliceClearance] = useState('');
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [interviewNotes, setInterviewNotes] = useState('');
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
        const stage = data.verificationStages?.stage4_ethicsReview;
        if (stage) {
          setStatus(stage.status || 'pending');
          setBackgroundCheckCompleted(Boolean(stage.backgroundCheckCompleted));
          if (stage.backgroundCheckUrl) setBackgroundCheckUrl(stage.backgroundCheckUrl);
          if (stage.policeClearance) setPoliceClearance(stage.policeClearance);
          setInterviewCompleted(Boolean(stage.interviewCompleted));
          if (stage.interviewNotes) setInterviewNotes(stage.interviewNotes);
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

      setSubmitting(true);
      const res = await fetch(`${apiBase}/tutors/${tutorId}/verification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stage: 'stage4_ethicsReview',
          status: 'in-review',
          data: {
            backgroundCheckCompleted,
            backgroundCheckUrl: backgroundCheckUrl.trim() || undefined,
            policeClearance: policeClearance.trim() || undefined,
            interviewCompleted,
            interviewNotes: interviewNotes.trim() || undefined,
            notes: notes.trim() || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to submit ethics/background info');
      const newStatus = json.data?.verificationStages?.stage4_ethicsReview?.status || 'in-review';
      setStatus(newStatus);
      setMessage('Submitted. Stage set to in-review.');
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
            <h1 className="text-3xl font-bold">Stage 4: Ethics & Background</h1>
            <p className="text-gold mt-1">Provide background/safeguarding details.</p>
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
            <h2 className="text-xl font-bold text-maroon">What to submit</h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
              Status: {status}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>Background/safeguarding clearance (link or upload location).</li>
            <li>Police clearance if applicable.</li>
            <li>Confirm completion of required ethics/safeguarding training/interview.</li>
          </ul>
          <p className="text-sm text-gray-600">
            If you have a PDF stored externally, share a link; otherwise, note where we can verify it.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={backgroundCheckCompleted}
                onChange={(e) => setBackgroundCheckCompleted(e.target.checked)}
                className="h-4 w-4 text-maroon"
              />
              Background check completed
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={interviewCompleted}
                onChange={(e) => setInterviewCompleted(e.target.checked)}
                className="h-4 w-4 text-maroon"
              />
              Ethics interview/training completed
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Background check URL</label>
              <input
                value={backgroundCheckUrl}
                onChange={(e) => setBackgroundCheckUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="https://... or brief location notes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Police clearance (link or ID)</label>
              <input
                value={policeClearance}
                onChange={(e) => setPoliceClearance(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="Optional if applicable"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Interview notes (optional)</label>
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes to reviewer (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                rows={3}
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
              {submitting ? 'Submitting…' : 'Submit'}
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
                onClick={() => router.push('/tutor/verification/stage5')}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue to Stage 5
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
