import type { Metadata } from 'next';
import Link from 'next/link';
import FilterableTutors from '../components/FilterableTutors';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'GMAT Prep | SmartLearning by Caesarea College',
  description:
    'GMAT preparation with adaptive quant and verbal drills, data insights, and timed mock exams to raise your score.',
};

export default function GMATPage() {
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
            <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">GMAT prep</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Score higher with targeted GMAT coaching</h1>
            <p className="text-lg text-gray-100">
              Learn GMAT strategies used by top scorers—data sufficiency logic, sentence correction accuracy, critical
              reasoning patterns, and timed practice tuned to your goal score.
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
            <h2 className="text-2xl font-bold text-maroon">Program highlights</h2>
            <ul className="space-y-2 text-gray-800">
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Diagnostic to identify quant/verbal gaps and set a realistic target score.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Data Sufficiency frameworks to cut guesswork and reduce careless errors.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Sentence Correction and Critical Reasoning pattern recognition with drills.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Integrated Reasoning and AWA practice with scored feedback.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Weekly timed mocks and analytics to tighten pacing and accuracy.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-14 px-6 grid md:grid-cols-3 gap-6">
        {[
          { title: 'Quant', desc: 'Number properties, algebra, word problems, and data sufficiency muscle memory.' },
          { title: 'Verbal', desc: 'SC grammar rules, CR argument patterns, RC speed and retention drills.' },
          { title: 'Strategy', desc: 'Pacing plans, educated guessing, review loops, and score tracking.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-black">{item.title}</h3>
            <p className="text-gray-700 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <FilterableTutors
          heading="Filter GMAT tutors and courses"
          description="Choose score goals, section focus, and class format."
          filters={[
            {
              label: 'Target Score',
              type: 'single',
              options: [
                { label: '600+', value: '600+' },
                { label: '650+', value: '650+' },
                { label: '700+', value: '700+' },
                { label: '740+', value: '740+' },
              ],
            },
            {
              label: 'Section Focus',
              options: [
                { label: 'Quant', value: 'Quant' },
                { label: 'Verbal', value: 'Verbal' },
                { label: 'Data Sufficiency', value: 'Data Sufficiency' },
                { label: 'Sentence Correction', value: 'Sentence Correction' },
                { label: 'Critical Reasoning', value: 'Critical Reasoning' },
                { label: 'Reading Comprehension', value: 'Reading Comprehension' },
                { label: 'Integrated Reasoning/AWA', value: 'IR/AWA' },
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
                { label: 'Mocks & reviews', value: 'Mocks & reviews' },
              ],
            },
          ]}
          tutors={[
            {
              name: 'Priya S.',
              title: 'GMAT Coach | 700+ Focus',
              tags: ['700+', '740+', 'Quant', 'Verbal', 'Data Sufficiency', 'Intensive', '1-on-1', 'Weekdays'],
              description: 'Score-raising plans with timed quant/verbal drills and weekly mock reviews.',
            },
            {
              name: 'Ethan D.',
              title: 'Quant & IR Specialist',
              tags: ['650+', '700+', 'Quant', 'Data Sufficiency', 'IR/AWA', 'Evenings', 'Small group'],
              description: 'Deep practice on DS/PS plus integrated reasoning with pacing strategies.',
            },
            {
              name: 'Lara M.',
              title: 'Verbal Strategist',
              tags: ['600+', '650+', 'Verbal', 'Sentence Correction', 'Critical Reasoning', 'Reading Comprehension', 'Weekends', 'Mocks & reviews'],
              description: 'CR/SC pattern training with review loops and targeted reading drills.',
            },
          ]}
        />
      </section>
    </main>
  );
}
