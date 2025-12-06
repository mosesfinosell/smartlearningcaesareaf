'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

export default function TutorStage5Page() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [status, setStatus] = useState<StageStatus>('pending');
  const [language, setLanguage] = useState('');
  const [testScore, setTestScore] = useState<number | ''>('');
  const [passingScore, setPassingScore] = useState<number | ''>(70);
  const [testUrl, setTestUrl] = useState('');
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
        const stage = data.verificationStages?.stage5_languageTest;
        if (stage) {
          setStatus(stage.status || 'pending');
          if (stage.language) setLanguage(stage.language);
          if (typeof stage.testScore === 'number') setTestScore(stage.testScore);
          if (typeof stage.passingScore === 'number') setPassingScore(stage.passingScore);
          if (stage.testUrl) setTestUrl(stage.testUrl);
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

      if (!language.trim()) throw new Error('Please enter the language.');
      if (testScore === '' || Number.isNaN(testScore)) throw new Error('Please enter your test score.');

      setSubmitting(true);
      const res = await fetch(`${apiBase}/tutors/${tutorId}/verification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stage: 'stage5_languageTest',
          status: 'in-review',
          data: {
            language: language.trim(),
            testScore: typeof testScore === 'number' ? testScore : Number(testScore),
            passingScore: passingScore === '' ? undefined : passingScore,
            testUrl: testUrl.trim() || undefined,
            notes: notes.trim() || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to submit test score');
      const newStatus = json.data?.verificationStages?.stage5_languageTest?.status || 'in-review';
      setStatus(newStatus);
      setMessage('Language test submitted. Stage set to in-review.');
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
            <h1 className="text-3xl font-bold">Stage 5: Language Proficiency</h1>
            <p className="text-gold mt-1">Submit your language test score and details.</p>
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
            <li>Language tested, score achieved, and passing score.</li>
            <li>Link or reference to your certificate/score report.</li>
            <li>Ensure the test is recent and from a recognized provider.</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="e.g., English, French, Yoruba"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Test score</label>
              <input
                type="number"
                value={testScore}
                onChange={(e) => setTestScore(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="e.g., 100"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Passing score</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="Default 70"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Certificate/score link (optional)</label>
              <input
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
              rows={3}
              placeholder="Test date, provider, format, or other context."
            />
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
              {submitting ? 'Submitting…' : 'Submit score'}
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
                onClick={() => router.push('/tutor/verification/stage6')}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue to Stage 6
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
