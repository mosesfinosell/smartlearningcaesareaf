'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

type Reference = {
  name: string;
  position: string;
  institution: string;
  email: string;
  phone: string;
  verified?: boolean;
};

export default function TutorStage2Page() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [status, setStatus] = useState<StageStatus>('pending');
  const [refs, setRefs] = useState<Reference[]>([
    { name: '', position: '', institution: '', email: '', phone: '' },
    { name: '', position: '', institution: '', email: '', phone: '' },
  ]);
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
        if (!res.ok || !data?._id) {
          throw new Error(json.message || 'Unable to load tutor profile');
        }
        setTutorId(data._id);
        const stageStatus =
          data.verificationStages?.stage2_experienceVerification?.status || 'pending';
        setStatus(stageStatus);
        if (Array.isArray(data.verificationStages?.stage2_experienceVerification?.references)) {
          const existing = data.verificationStages.stage2_experienceVerification.references as Reference[];
          setRefs(existing.length > 0 ? existing : refs);
        }
        if (data.verificationStages?.stage2_experienceVerification?.notes) {
          setNotes(data.verificationStages.stage2_experienceVerification.notes);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load verification data');
      }
    };

    loadTutor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, router]);

  const updateRefField = (index: number, field: keyof Reference, value: string) => {
    setRefs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addReference = () => {
    setRefs((prev) => [...prev, { name: '', position: '', institution: '', email: '', phone: '' }]);
  };

  const removeReference = (index: number) => {
    setRefs((prev) => prev.filter((_, i) => i !== index));
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

      const cleanedRefs = refs
        .map((r) => ({
          name: r.name.trim(),
          position: r.position.trim(),
          institution: r.institution.trim(),
          email: r.email.trim(),
          phone: r.phone.trim(),
        }))
        .filter((r) => r.name && r.email && r.phone);

      if (cleanedRefs.length < 2) {
        throw new Error('Please provide at least two references with name, email, and phone.');
      }

      setSubmitting(true);
      const res = await fetch(`${apiBase}/tutors/${tutorId}/verification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stage: 'stage2_experienceVerification',
          status: 'in-review',
          data: {
            references: cleanedRefs,
            notes: notes.trim() || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to submit references');
      }
      const newStatus =
        json.data?.verificationStages?.stage2_experienceVerification?.status || 'in-review';
      setStatus(newStatus);
      setMessage('References submitted. Stage set to in-review.');
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
            <h1 className="text-3xl font-bold">Stage 2: Experience & References</h1>
            <p className="text-gold mt-1">Provide references and experience proof for verification.</p>
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
            <li>At least two professional references (supervisors/colleagues) who can confirm your teaching experience.</li>
            <li>Accurate contact details (email and phone) so we can verify quickly.</li>
            <li>Use institutional/work emails when possible for faster verification.</li>
          </ul>
          <p className="text-sm text-gray-600">
            Keep references informed we will contact them. Include context (role, institution, dates) in the notes if needed.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-maroon">References</h3>
            <button
              onClick={addReference}
              className="text-sm font-semibold text-maroon hover:text-red-900"
              type="button"
            >
              + Add another reference
            </button>
          </div>

          <div className="space-y-4">
            {refs.map((ref, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">Reference {idx + 1}</p>
                  {refs.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeReference(idx)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      value={ref.name}
                      onChange={(e) => updateRefField(idx, 'name', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      value={ref.position}
                      onChange={(e) => updateRefField(idx, 'position', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="e.g., Supervisor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institution</label>
                    <input
                      value={ref.institution}
                      onChange={(e) => updateRefField(idx, 'institution', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="School/Organization"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={ref.email}
                      onChange={(e) => updateRefField(idx, 'email', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      value={ref.phone}
                      onChange={(e) => updateRefField(idx, 'phone', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
                      placeholder="+234..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <h3 className="text-lg font-semibold text-maroon">Notes (optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon"
            rows={3}
            placeholder="Add context: roles/dates with these references, teaching modality, etc."
          />
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
              {submitting ? 'Submitting…' : 'Submit references'}
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

        <section className="bg-white rounded-lg shadow-md p-6 space-y-2">
          <h3 className="text-lg font-semibold text-maroon">Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>Give at least two strong references with direct knowledge of your teaching.</li>
            <li>Use professional/institutional emails; double-check phone numbers.</li>
            <li>Tell references to expect our call/email so they respond quickly.</li>
            <li>If you freelanced, include clients or platform supervisors (with links if available).</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
