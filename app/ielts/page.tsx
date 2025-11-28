import type { Metadata } from 'next';
import Link from 'next/link';
import FilterableTutors from '../components/FilterableTutors';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'IELTS Preparation | SmartLearning by Caesarea College',
  description:
    'Personalized IELTS prep with expert tutors, mock tests, and speaking drills to help you hit your target band score.',
};

export default function IELTSPage() {
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
            <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">IELTS prep</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Hit your target band score faster</h1>
            <p className="text-lg text-gray-100">
              Work 1:1 with IELTS specialists, sit timed mock exams, and fix weaknesses in speaking, writing, listening,
              and reading with targeted feedback.
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
            <h2 className="text-2xl font-bold text-maroon">What you’ll get</h2>
            <ul className="space-y-2 text-gray-800">
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Level check and custom study plan for Academic or General Training.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Speaking drills with live feedback on pronunciation, coherence, and vocabulary range.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Writing Task 1 & 2 corrections with band-level rubrics and model answers.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Listening and reading strategies with timed practice and review.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Weekly mock tests to measure progress and adjust focus areas.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-14 px-6 grid md:grid-cols-3 gap-6">
        {[
          { title: 'Speaking', desc: 'Accent clarity, lexical range, fluency, and confidence through live drills and interviews.' },
          { title: 'Writing', desc: 'Task achievement, cohesion, grammar, and vocabulary with iterative corrections.' },
          { title: 'Listening & Reading', desc: 'Scanning, skimming, inference, and time management strategies.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-black">{item.title}</h3>
            <p className="text-gray-700 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <FilterableTutors
          heading="Filter IELTS tutors and courses"
          description="Refine by target band, section focus, pace, and format."
          filters={[
            {
              label: 'Target Band',
              type: 'single',
              options: [
                { label: 'Band 6+', value: 'Band 6+' },
                { label: 'Band 7+', value: 'Band 7+' },
                { label: 'Band 8+', value: 'Band 8+' },
              ],
            },
            {
              label: 'Section Focus',
              options: [
                { label: 'Speaking', value: 'Speaking' },
                { label: 'Writing Task 1', value: 'Writing Task 1' },
                { label: 'Writing Task 2', value: 'Writing Task 2' },
                { label: 'Listening', value: 'Listening' },
                { label: 'Reading', value: 'Reading' },
              ],
            },
            {
              label: 'Schedule',
              options: [
                { label: 'Intensive', value: 'Intensive' },
                { label: 'Weekdays', value: 'Weekdays' },
                { label: 'Weekends', value: 'Weekends' },
                { label: 'Evenings', value: 'Evenings' },
              ],
            },
            {
              label: 'Format',
              options: [
                { label: '1-on-1', value: '1-on-1' },
                { label: 'Small group', value: 'Small group' },
                { label: 'Mocks only', value: 'Mocks only' },
              ],
            },
          ]}
          tutors={[
            {
              name: 'Sarah K.',
              title: 'IELTS Specialist | Band 7-8',
              tags: ['Band 7+', 'Band 8+', 'Speaking', 'Writing Task 2', 'Intensive', '1-on-1', 'Weekdays'],
              description: 'Focuses on high-band speaking and writing drills with timed feedback and mock interviews.',
            },
            {
              name: 'Owen L.',
              title: 'IELTS Coach | Academic & General',
              tags: ['Band 6+', 'Band 7+', 'Writing Task 1', 'Listening', 'Reading', 'Small group', 'Weekends'],
              description: 'Balanced prep for Academic/General with data charts, reading strategies, and listening accuracy.',
            },
            {
              name: 'Amrita P.',
              title: 'IELTS Writing & Speaking',
              tags: ['Band 7+', 'Band 8+', 'Speaking', 'Writing Task 1', 'Writing Task 2', 'Evenings', 'Mocks only'],
              description: 'Essay structure, coherence, and lexical range with frequent mock scoring and corrections.',
            },
          ]}
        />
      </section>
    </main>
  );
}
