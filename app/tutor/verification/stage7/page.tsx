'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

type CurriculumTest = {
  curriculum: 'US' | 'UK' | 'Nigeria' | '';
  score?: number | '';
  passingScore?: number | '';
  testUrl?: string;
};

export default function TutorStage7Page() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [status, setStatus] = useState<StageStatus>('pending');
  const [tests, setTests] = useState<CurriculumTest[]>([
    { curriculum: '', score: '', passingScore: 80, testUrl: '' },
  ]);
  const [lessonPlanSubmitted, setLessonPlanSubmitted] = useState(false);
  const [lessonPlanUrl, setLessonPlanUrl] = useState('');
  const [lessonPlanRating, setLessonPlanRating] = useState<number | ''>('');
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
        const stage = data.verificationStages?.stage7_curriculumAlignment;
        if (stage) {
          setStatus(stage.status || 'pending');
          if (Array.isArray(stage.curriculumTest) && stage.curriculumTest.length) {
            setTests(
              stage.curriculumTest.map((t: any) => ({
                curriculum: t.curriculum,
                score: typeof t.score === 'number' ? t.score : '',
                passingScore: typeof t.passingScore === 'number' ? t.passingScore : '',
                testUrl: t.testUrl || '',
              }))
            );
          }
          if (typeof stage.lessonPlanSubmitted === 'boolean') setLessonPlanSubmitted(stage.lessonPlanSubmitted);
          if (stage.lessonPlanUrl) setLessonPlanUrl(stage.lessonPlanUrl);
          if (typeof stage.lessonPlanRating === 'number') setLessonPlanRating(stage.lessonPlanRating);
          if (stage.notes) setNotes(stage.notes);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load verification data');
      }
    };
    loadTutor();
  }, [apiBase, router]);

  const updateTestField = (index: number, field: keyof CurriculumTest, value: any) => {
    setTests((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addTest = () => {
    setTests((prev) => [...prev, { curriculum: '', score: '', passingScore: 80, testUrl: '' }]);
  };

  const removeTest = (index: number) => {
    setTests((prev) => prev.filter((_, i) => i !== index));
  };

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

      const cleanedTests = tests
        .map((t) => ({
          curriculum: t.curriculum,
          score: t.score === '' ? undefined : t.score,
          passingScore: t.passingScore === '' ? undefined : t.passingScore,
          testUrl: t.testUrl?.trim() || undefined,
        }))
        .filter((t) => t.curriculum);

      if (cleanedTests.length === 0) {
        throw new Error('Add at least one curriculum test entry.');
      }

      setSubmitting(true);
      const res = await fetch(`${apiBase}/tutors/${tutorId}/verification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stage: 'stage7_curriculumAlignment',
          status: 'in-review',
          data: {
            curriculumTest: cleanedTests,
            lessonPlanSubmitted,
            lessonPlanUrl: lessonPlanUrl.trim() || undefined,
            lessonPlanRating: lessonPlanRating === '' ? undefined : lessonPlanRating,
            notes: notes.trim() || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to submit curriculum alignment');
      const newStatus = json.data?.verificationStages?.stage7_curriculumAlignment?.status || 'in-review';
      setStatus(newStatus);
      setMessage('Curriculum alignment submitted. Stage set to in-review.');
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
            <h1 className="text-3xl font-bold">Stage 7: Curriculum Alignment</h1>
            <p className="text-gold mt-1">Submit curriculum test info and lesson plan alignment.</p>
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
            <li>Curriculum test results (US/UK/Nigeria) with scores and passing thresholds.</li>
            <li>Lesson plan submission and (if applicable) a link to the plan.</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-maroon">Curriculum tests</h3>
            <button
              onClick={addTest}
              className="text-sm font-semibold text-maroon hover:text-red-900"
              type="button"
            >
              + Add another test
            </button>
          </div>

          <div className="space-y-4">
            {tests.map((test, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">Test {idx + 1}</p>
                  {tests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTest(idx)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Curriculum</label>
                    <select
                      value={test.curriculum}
                      onChange={(e) => updateTestField(idx, 'curriculum', e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                    >
                      <option value="">Select curriculum</option>
                      <option value="US">US</option>
                      <option value="UK">UK</option>
                      <option value="Nigeria">Nigeria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Score</label>
                    <input
                      type="number"
                      value={test.score}
                      onChange={(e) => updateTestField(idx, 'score', e.target.value ? Number(e.target.value) : '')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="e.g., 85"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Passing score</label>
                    <input
                      type="number"
                      value={test.passingScore}
                      onChange={(e) =>
                        updateTestField(idx, 'passingScore', e.target.value ? Number(e.target.value) : '')
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="Default 80"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Test link (optional)</label>
                    <input
                      value={test.testUrl || ''}
                      onChange={(e) => updateTestField(idx, 'testUrl', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-maroon">Lesson plan</h3>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={lessonPlanSubmitted}
              onChange={(e) => setLessonPlanSubmitted(e.target.checked)}
              className="h-4 w-4 text-maroon"
            />
            Lesson plan submitted
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lesson plan link (optional)</label>
              <input
                value={lessonPlanUrl}
                onChange={(e) => setLessonPlanUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lesson plan rating (if available)</label>
              <input
                type="number"
                value={lessonPlanRating}
                onChange={(e) => setLessonPlanRating(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="0-100"
                min={0}
                max={100}
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
              placeholder="Additional context on curriculum alignment or lesson plan."
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
              {submitting ? 'Submitting…' : 'Submit alignment'}
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
        </section>
      </main>
    </div>
  );
}
