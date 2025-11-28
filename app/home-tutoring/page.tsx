import type { Metadata } from 'next';
import Link from 'next/link';
import FilterableTutors from '../components/FilterableTutors';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'Home Tutoring | SmartLearning',
  description: 'Find vetted home tutors by subject, level, schedule, and learning goals.',
};

export default function HomeTutoringPage() {
  return (
    <main className="min-h-screen bg-cream text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-maroon font-semibold">Home Tutoring</p>
            <h1 className="text-3xl md:text-4xl font-bold text-maroon">Find the right home tutor fast</h1>
            <p className="text-gray-600">Filter by subject, level, goals, and schedule to see your best matches.</p>
          </div>
          <Link href="/" className="text-maroon font-semibold hover:underline inline-flex items-center gap-1">
            <span aria-hidden="true">←</span>
            <span>Back home</span>
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
          <h2 className="text-2xl font-bold text-maroon">Talk to us</h2>
          <p className="text-gray-700">
            Need help matching? Book a call or message us—our team will recommend tutors and set up demos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={calendarLink}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-maroon text-white px-5 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              Book a call
              <i className="fa-solid fa-calendar-check" aria-hidden="true" />
            </Link>
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 border border-maroon text-maroon px-5 py-3 rounded-lg font-semibold hover:bg-cream transition-colors"
            >
              Chat on WhatsApp
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <FilterableTutors
          heading="Filter home tutors"
          description="Set your subject, level, availability, and preferences."
          filters={[
            {
              label: 'Subject',
              options: [
                { label: 'Math', value: 'Math' },
                { label: 'Science', value: 'Science' },
                { label: 'English', value: 'English' },
                { label: 'Languages', value: 'Languages' },
                { label: 'Coding', value: 'Coding' },
                { label: 'Music', value: 'Music' },
              ],
            },
            {
              label: 'Level',
              options: [
                { label: 'Primary', value: 'Primary' },
                { label: 'Junior Secondary', value: 'Junior Secondary' },
                { label: 'Senior Secondary', value: 'Senior Secondary' },
                { label: 'Exam Prep', value: 'Exam Prep' },
              ],
            },
            {
              label: 'Goals',
              options: [
                { label: 'Grades improvement', value: 'Grades improvement' },
                { label: 'Exam readiness', value: 'Exam readiness' },
                { label: 'Confidence building', value: 'Confidence building' },
                { label: 'Skills enrichment', value: 'Skills enrichment' },
              ],
            },
            {
              label: 'Schedule',
              options: [
                { label: 'Weekdays', value: 'Weekdays' },
                { label: 'Weekends', value: 'Weekends' },
                { label: 'Mornings', value: 'Mornings' },
                { label: 'Evenings', value: 'Evenings' },
              ],
            },
          ]}
          tutors={[
            {
              name: 'Mr. Ade',
              title: 'Math & Science | Secondary',
              tags: ['Math', 'Science', 'Senior Secondary', 'Exam Prep', 'Grades improvement', 'Weekdays', 'Evenings'],
              description: 'STEM-focused home tutoring with exam drills and progress tracking.',
            },
            {
              name: 'Mrs. Bello',
              title: 'English & Languages | Primary',
              tags: ['English', 'Languages', 'Primary', 'Confidence building', 'Weekends', 'Mornings'],
              description: 'Reading, writing, and speaking confidence for younger learners at home.',
            },
            {
              name: 'Tunde A.',
              title: 'Coding & Math | Jnr Secondary',
              tags: ['Coding', 'Math', 'Junior Secondary', 'Skills enrichment', 'Weekdays', 'Evenings'],
              description: 'Intro to coding with math reinforcement and project-based learning.',
            },
            {
              name: 'Chioma E.',
              title: 'Music & Creative | All Levels',
              tags: ['Music', 'Skills enrichment', 'Confidence building', 'Weekends'],
              description: 'Home music lessons with theory and performance practice.',
            },
          ]}
        />
      </section>
    </main>
  );
}
