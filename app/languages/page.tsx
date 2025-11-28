import type { Metadata } from 'next';
import Link from 'next/link';
import FilterableTutors from '../components/FilterableTutors';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'Learn English With Confidence | SmartLearning',
  description:
    'Personalized English learning for school, work, business, travel, and global opportunities with live classes and expert tutors.',
};

export default function LanguagesPage() {
  return (
    <main className="bg-cream min-h-screen text-gray-900">
      <nav className="bg-white text-maroon shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-start gap-2">
            <div className="text-3xl font-bold leading-none">SmartLearning</div>
            <div className="text-[10px] leading-3 text-black translate-y-[-6px]">
              <div>CC</div>
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
            <Link href="/" className="text-maroon font-semibold hover:underline inline-flex items-center gap-1">
              <span aria-hidden="true">←</span>
              <span>Back home</span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-maroon to-black text-white py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">Language Learning</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Learn English With Confidence</h1>
              <p className="text-lg text-gray-100">
                Build fluent communication skills for school, work, business, travel, and global opportunities. Personalized,
                live learning for real-life results.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={calendarLink}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 bg-gold text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Book a consultation
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
            <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-xl border border-white/20 space-y-3">
              <h2 className="text-2xl font-bold text-maroon">Why learn English with us</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-800">
                <li>
                  <span className="font-semibold">Global-standard tutors</span> — experienced instructors trained in international methods.
                </li>
                <li>
                  <span className="font-semibold">Personalized learning paths</span> — aligned to career, travel, relocation, school, or exams.
                </li>
                <li>
                  <span className="font-semibold">Live interactive classes</span> — speaking, listening, pronunciation, role-play, real tasks.
                </li>
                <li>
                  <span className="font-semibold">Trusted by parents and professionals</span> — for all ages and levels.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <FilterableTutors
          heading="Filter tutors and courses"
          description="Match by language, level, goal, and schedule."
          filters={[
            {
              label: 'Language',
              type: 'single',
              options: [
                { label: 'English', value: 'English' },
                { label: 'French', value: 'French' },
                { label: 'Chinese', value: 'Chinese' },
                { label: 'German', value: 'German' },
                { label: 'Yoruba', value: 'Yoruba' },
                { label: 'Hausa', value: 'Hausa' },
                { label: 'Igbo', value: 'Igbo' },
              ],
            },
            {
              label: 'Level',
              options: [
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
              ],
            },
            {
              label: 'Goal',
              options: [
                { label: 'Conversation', value: 'Conversation' },
                { label: 'Business', value: 'Business' },
                { label: 'Academic', value: 'Academic' },
                { label: 'Travel', value: 'Travel' },
                { label: 'Exam Prep', value: 'Exam Prep' },
                { label: 'Kids/Teens', value: 'Kids/Teens' },
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
              name: 'Amaka O.',
              title: 'English & Yoruba | Kids/Teens',
              tags: ['English', 'Yoruba', 'Beginner', 'Intermediate', 'Kids/Teens', 'Conversation', 'Weekends', 'Evenings'],
              description: 'Builds confidence for young learners with phonics, conversation, and reading practice.',
            },
            {
              name: 'Jean P.',
              title: 'French | Business & Conversation',
              tags: ['French', 'Business', 'Conversation', 'Intermediate', 'Advanced', 'Weekdays'],
              description: 'Corporate French for meetings, presentations, and professional etiquette.',
            },
            {
              name: 'Chen L.',
              title: 'Chinese (Mandarin) | Exam Prep & Travel',
              tags: ['Chinese', 'Exam Prep', 'Travel', 'Beginner', 'Intermediate', 'Weekends'],
              description: 'HSK-focused curriculum with tones, characters, and real-life speaking drills.',
            },
            {
              name: 'Jürgen M.',
              title: 'German | Academic & Travel',
              tags: ['German', 'Academic', 'Travel', 'Intermediate', 'Advanced', 'Weekdays', 'Evenings'],
              description: 'Academic German for studies abroad with speaking, reading, and writing practice.',
            },
            {
              name: 'Hauwa S.',
              title: 'Hausa & English | Conversation',
              tags: ['Hausa', 'English', 'Conversation', 'Beginner', 'Intermediate', 'Weekdays', 'Weekends'],
              description: 'Practical conversation lessons with cultural context for everyday use.',
            },
          ]}
        />

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
          <h3 className="text-2xl font-bold text-maroon">What you will learn</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-800">
            <div>
              <h4 className="text-lg font-semibold text-black">Conversational English</h4>
              <p className="text-sm">Everyday expressions, pronunciation, listening, social conversation, travel communication.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black">Corporate and Business English</h4>
              <p className="text-sm">Workplace communication, email/report writing, presentations, negotiation language, meetings, etiquette.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black">Academic English</h4>
              <p className="text-sm">Academic writing, essay structure, research skills, reading comprehension, vocabulary, exam prep.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black">Exam Preparation English</h4>
              <p className="text-sm">IELTS, TOEFL, Cambridge, SAT verbal — targeted coaching and practice.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black">Accent Training & Pronunciation</h4>
              <p className="text-sm">Clarity, accuracy, and confidence when speaking.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black">English for Kids and Teens</h4>
              <p className="text-sm">Grammar, reading, creative writing, vocabulary, and speaking confidence.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
          <h3 className="text-2xl font-bold text-maroon">How our classes work</h3>
          <ul className="space-y-2 text-gray-800 list-disc list-inside">
            <li>One-on-one or small group</li>
            <li>Flexible scheduling</li>
            <li>Tutor matching</li>
            <li>Monthly progress reports</li>
            <li>Safe learning environment</li>
            <li>Optional parent-tutor communication portal</li>
          </ul>

          <h3 className="text-2xl font-bold text-maroon mt-6">Our teaching approach</h3>
          <ul className="space-y-2 text-gray-800 list-disc list-inside">
            <li>Real-life communication and role-play</li>
            <li>Case studies, listening and speaking drills</li>
            <li>Vocabulary development and practical scenarios (school, work, business, travel)</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
          <h3 className="text-2xl font-bold text-maroon">Different types of English we teach</h3>
          <div className="grid md:grid-cols-2 gap-3 text-gray-800">
            {[
              'Conversational English',
              'Corporate English',
              'Academic English',
              'Creative English',
              'Travel English',
              'Exam English (IELTS, TOEFL, SAT, Cambridge)',
              'Technical and Industry English (tech, engineering, healthcare, finance, customer service)',
            ].map((item) => (
              <div key={item} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-maroon text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Start Your English Journey</h2>
          <p className="text-gray-100 max-w-3xl mx-auto">
            Improve your communication skills and unlock global opportunities. Book a consultation and begin your personalized learning path today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
            <Link
              href={calendarLink}
              target="_blank"
              rel="noopener"
              className="bg-gold text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Book a consultation
            </Link>
            <Link
              href="/register"
              className="border border-white/40 px-6 py-3 rounded-lg font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
