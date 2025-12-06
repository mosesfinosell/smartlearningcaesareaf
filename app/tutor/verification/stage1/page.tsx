'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'no-show';

export default function TutorStage1Page() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [status, setStatus] = useState<StageStatus>('pending');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

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
          data.verificationStages?.stage1_certificationVerification?.status || 'pending';
        setStatus(stageStatus);
      } catch (err: any) {
        setError(err.message || 'Failed to load verification data');
      }
    };

    loadTutor();
  }, [apiBase, router]);

  const handleUpload = async () => {
    try {
      setError('');
      setMessage('');
      if (!tutorId) {
        throw new Error('Tutor profile not found');
      }
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const fileInput = fileInputRef.current;
      const files = fileInput?.files;
      if (!files || files.length === 0) {
        throw new Error('Please choose at least one file to upload');
      }

      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));

      setUploading(true);
      const res = await fetch(`${apiBase}/tutors/${tutorId}/verification/stage1/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Upload failed');
      }

      setStatus(json.data?.stage1?.status || 'in-review');
      setMessage('Documents uploaded. Stage set to in-review.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Stage 1: Credentials & ID</h1>
            <p className="text-gold mt-1">Upload your core documents to begin verification.</p>
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
            <li>Government-issued photo ID (passport, driver’s license, or national ID).</li>
            <li>Proof of address (utility bill or bank statement dated within 3 months).</li>
            <li>Degree/certification documents relevant to your teaching.</li>
            <li>Right-to-work/work permit (if applicable).</li>
            <li>Confirm your contact details (email/phone/WhatsApp) are current.</li>
          </ul>
          <p className="text-sm text-gray-600">
            Keep files clear and legible. Redact sensitive numbers on supporting docs except where required for verification.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-maroon">Uploads</h3>
          <p className="text-gray-700">
            You can upload multiple files (PDF, JPG, PNG, WEBP). After upload, this stage moves to “in-review”.
          </p>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-maroon file:text-white hover:file:bg-red-900"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`bg-maroon text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-900 transition-colors ${
                  uploading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Uploading…' : 'Upload documents'}
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
                  onClick={() => router.push('/tutor/verification/stage2')}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Continue to Stage 2
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 space-y-2">
          <h3 className="text-lg font-semibold text-maroon">Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>Make sure names match across all documents.</li>
            <li>Check ID expiry dates; expired IDs will be rejected.</li>
            <li>If your name differs, include a name-change document or affidavit.</li>
            <li>Use PDF or high-resolution images; avoid blurry photos.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
