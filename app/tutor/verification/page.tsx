'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type StageKey =
  | 'stage1_certificationVerification'
  | 'stage2_experienceVerification'
  | 'stage3_demoVideo'
  | 'stage4_ethicsReview'
  | 'stage5_languageTest'
  | 'stage6_introductoryCall'
  | 'stage7_curriculumAlignment';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

type TutorProfile = {
  _id: string;
  overallVerificationStatus?: string;
  verificationStatus?: string;
  verificationStages?: Partial<Record<StageKey, { status?: StageStatus }>>;
};

const stageDefinitions: { key: StageKey; title: string; summary: string; path?: string }[] = [
  { key: 'stage1_certificationVerification', title: 'Stage 1: Credentials & ID', summary: 'Upload degrees, certifications, ID, and right-to-work documents.', path: '/tutor/verification/stage1' },
  { key: 'stage2_experienceVerification', title: 'Stage 2: Experience', summary: 'Provide references and proof of teaching experience.', path: '/tutor/verification/stage2' },
  { key: 'stage3_demoVideo', title: 'Stage 3: Teaching Demo', summary: 'Submit a sample lesson/demo video for review.', path: '/tutor/verification/stage3' },
  { key: 'stage4_ethicsReview', title: 'Stage 4: Ethics & Background', summary: 'Complete background/safeguarding checks and ethics interview.', path: '/tutor/verification/stage4' },
  { key: 'stage5_languageTest', title: 'Stage 5: Language Proficiency', summary: 'Take/submit your language proficiency test score.', path: '/tutor/verification/stage5' },
  { key: 'stage6_introductoryCall', title: 'Stage 6: Introductory Call', summary: 'Schedule and complete the onboarding call.', path: '/tutor/verification/stage6' },
  { key: 'stage7_curriculumAlignment', title: 'Stage 7: Curriculum Alignment', summary: 'Submit curriculum/lesson plan alignment and required scores.', path: '/tutor/verification/stage7' },
];

const statusStyles: Record<string, string> = {
  approved: 'bg-green-100 text-green-800 border border-green-200',
  'in-review': 'bg-blue-100 text-blue-800 border border-blue-200',
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  rejected: 'bg-red-100 text-red-800 border border-red-200',
  scheduled: 'bg-purple-100 text-purple-800 border border-purple-200',
  completed: 'bg-green-100 text-green-800 border border-green-200',
  'no-show': 'bg-orange-100 text-orange-800 border border-orange-200',
};

export default function TutorVerificationPage() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
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
        if (!res.ok || !data) {
          throw new Error(json.message || 'Failed to load verification data');
        }
        setProfile(data as TutorProfile);
      } catch (err: any) {
        console.error('Verification page error:', err);
        setError(err.message || 'Unable to load verification details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiBase, router]);

  const overallStatus = (profile?.overallVerificationStatus || profile?.verificationStatus || 'pending') as StageStatus;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-maroon text-xl">Loading verification...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-maroon text-lg mb-2">Verification details unavailable</p>
          <p className="text-gray-600 mb-4">{error || 'Please try again from your dashboard.'}</p>
          <button
            onClick={() => router.push('/tutor/dashboard')}
            className="bg-maroon text-white px-6 py-2 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tutor Verification</h1>
            <p className="text-gold mt-1">Complete each stage to go live.</p>
          </div>
          <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusStyles[overallStatus] || 'bg-yellow-100 text-yellow-800 border border-yellow-200'} bg-opacity-90`}>
            Overall Status: {overallStatus}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-maroon mb-4">How to start</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-800">
            <li>Begin at Stage 1 (credentials & ID) and submit required documents.</li>
            <li>Once Stage 1 is approved, proceed to experience verification, demo video, and language test.</li>
            <li>Schedule your introductory call after your demo and language test are submitted.</li>
            <li>Watch for reviewer notes; resubmit any stages marked as “rejected” or “in-review”.</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            This page is the entry point—no separate link is needed. If you share a link with tutors, point them here after login:
            <span className="font-semibold text-maroon"> /tutor/verification</span>
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-maroon">Verification stages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stageDefinitions.map((stage) => {
              const status = (profile.verificationStages?.[stage.key]?.status || 'pending') as StageStatus;
              return (
                <div key={stage.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-500">{stage.title}</p>
                      <p className="text-sm text-gray-700">{stage.summary}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.pending}`}>
                      {status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {status === 'pending' && 'Action needed: upload or submit for this stage.'}
                    {status === 'in-review' && 'Submitted. We will notify you after review.'}
                    {status === 'approved' && 'Approved. You can move to the next stage.'}
                    {status === 'rejected' && 'Reviewer changes required. Please resubmit.'}
                    {status === 'scheduled' && 'Scheduled. Please attend at the agreed time.'}
                    {status === 'completed' && 'Completed. Awaiting final review.'}
                    {status === 'no-show' && 'Missed the session. Please reschedule.'}
                  </div>
                  {stage.path && (
                    <button
                      onClick={() => router.push(stage.path!)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:text-red-900"
                    >
                      {status === 'pending' ? 'Start this stage' : 'View details'}
                      <span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <h3 className="text-xl font-bold text-maroon">Need help?</h3>
          <p className="text-gray-700">Contact support via your tutor success email or reach out from the dashboard chat. Include your tutor code and the stage you are working on.</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/tutor/dashboard')}
              className="bg-maroon text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-900"
            >
              Back to Dashboard
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
