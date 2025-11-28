import type { Metadata } from 'next';
import Link from 'next/link';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'Music Lessons | SmartLearning by Caesarea College',
  description:
    'Learn piano, guitar, violin, saxophone, and music theory with expert instructors and performance-focused practice.',
};

export default function MusicPage() {
  const instruments = [
    { name: 'Piano', focus: 'Technique, sight-reading, chords, improvisation, and graded exams.' },
    { name: 'Guitar', focus: 'Fingerstyle and strumming, scales, fretboard fluency, and performance prep.' },
    { name: 'Violin', focus: 'Bow control, intonation, ensemble skills, and exam readiness.' },
    { name: 'Saxophone', focus: 'Tone production, articulation, jazz phrasing, and repertoire building.' },
    { name: 'Music Theory', focus: 'Harmony, ear training, rhythm, and composition basics.' },
  ];

  return (
    <main className="bg-cream min-h-screen text-gray-900">
      <nav className="bg-white text-maroon shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-start gap-2">
            <div className="text-3xl font-bold leading-none">SmartLearning</div>
            <div className="text-[10px] leading-3 text-black translate-y-[-6px]">
              <div>Caesarea College</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-black">
            <Link href="/featured-courses" className="hover:text-maroon transition-colors">
              Featured Courses
            </Link>
            <Link href="/blog" className="hover:text-maroon transition-colors">
              Blog
            </Link>
            <Link href="/register" className="bg-maroon text-white px-4 py-2 rounded-lg font-semibold hover:bg-black transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-maroon to-black text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-200 hover:text-gold text-sm">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              Back home
            </Link>
            <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">Music</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Play with confidence, guided by expert musicians</h1>
            <p className="text-lg text-gray-100">
              Personalized lessons for beginners to advanced players. Build technique, musicality, and performance skills with
              structured practice plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={calendarLink}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-gold text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Book a call
                <i className="fa-solid fa-calendar-check" aria-hidden="true" />
              </Link>
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 rounded-lg font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Chat on WhatsApp
                <i className="fa-brands fa-whatsapp" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-xl border border-white/20 space-y-4">
            <h2 className="text-2xl font-bold text-maroon">How we teach</h2>
            <ul className="space-y-2 text-gray-800">
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Technique-first approach with exercises matched to your instrument and level.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Performance goals—recitals, recordings, or graded exams—with feedback loops.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Music theory integration, ear training, and repertoire building.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Flexible schedules and recorded sessions so you can practice with guidance.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-14 px-6 grid md:grid-cols-3 gap-6">
        {instruments.map((instrument) => (
          <div key={instrument.name} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-black">{instrument.name}</h3>
            <p className="text-gray-700 text-sm">{instrument.focus}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
