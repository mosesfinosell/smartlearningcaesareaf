'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

export default function TutorStage3Page() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [status, setStatus] = useState<StageStatus>('pending');
  const [videoUrl, setVideoUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
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
        const stage = data.verificationStages?.stage3_demoVideo;
        if (stage) {
          setStatus(stage.status || 'pending');
          if (stage.videoUrl) setVideoUrl(stage.videoUrl);
          if (stage.topic) setTopic(stage.topic);
          if (typeof stage.duration === 'number') setDuration(stage.duration);
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

      if (!videoUrl.trim()) throw new Error('Provide a video URL (e.g., Drive, YouTube, Loom).');
      if (!topic.trim()) throw new Error('Provide the lesson topic.');

      setSubmitting(true);
      const res = await fetch(`${apiBase}/tutors/${tutorId}/verification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stage: 'stage3_demoVideo',
          status: 'in-review',
          data: {
            videoUrl: videoUrl.trim(),
            topic: topic.trim(),
            duration: duration || undefined,
            notes: notes.trim() || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to submit demo video');
      const newStatus = json.data?.verificationStages?.stage3_demoVideo?.status || 'in-review';
      setStatus(newStatus);
      setMessage('Demo video submitted. Stage set to in-review.');
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
            <h1 className="text-3xl font-bold">Stage 3: Teaching Demo</h1>
            <p className="text-gold mt-1">Submit your demo lesson video for review.</p>
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
            <li>20–30 minute demo lesson video (shareable link: Drive/YouTube/Loom/etc.).</li>
            <li>State your topic and intended student level.</li>
            <li>Ensure clear audio/video; include brief objectives at the start.</li>
          </ul>
          <p className="text-sm text-gray-600">
            If upload is large, host on Drive/YouTube/Vimeo/Loom and share a link with access enabled.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-maroon">Demo details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Video URL</label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="e.g., Essay structure for IELTS Writing Task 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="e.g., 25"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                rows={3}
                placeholder="Add context or lesson objectives"
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
              {submitting ? 'Submitting…' : 'Submit demo'}
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
                onClick={() => router.push('/tutor/verification/stage4')}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue to Stage 4
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
