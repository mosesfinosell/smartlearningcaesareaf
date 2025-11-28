import type { Metadata } from 'next';
import Link from 'next/link';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'Kids Learning | SmartLearning by Caesarea College',
  description:
    'Help your child excel with global tutors, phonetics and diction coaching, homework help, and confidence-building programs.',
};

export default function KidsPage() {
  const pillars = [
    {
      title: 'Global tutors for every subject',
      description:
        'Experienced K-12 tutors across math, science, literacy, and creative arts—matched to your child’s learning style and time zone.',
      icon: 'fa-earth-americas',
    },
    {
      title: 'Phonetics & diction coaching',
      description:
        'Certified language specialists to improve pronunciation, fluency, and confident speaking through fun, interactive sessions.',
      icon: 'fa-microphone-lines',
    },
    {
      title: 'Homework help & study skills',
      description:
        'Daily support for assignments, projects, and exams—plus routines that teach organization, focus, and independent study habits.',
      icon: 'fa-book-open-reader',
    },
    {
      title: 'Cultural Voyage',
      description:
        'Virtual adventures to museums, heritage sites, and cultural landmarks worldwide—guided by tutors who make history and geography come alive.',
      icon: 'fa-landmark',
    },
    {
      title: 'Better grades & confidence',
      description:
        'Track progress with clear milestones, practice plans, and regular feedback to keep your child motivated and improving.',
      icon: 'fa-chart-line',
    },
  ];

  const benefits = [
    '1:1 and small-group options for personalized attention',
    'Structured weekly plans with clear milestones',
    'Session recordings for review and parent visibility',
    'Safe, moderated online classrooms with vetted tutors',
    'Flexible schedules across time zones',
  ];

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

      <section className="bg-gradient-to-br from-maroon to-black text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">Kids program</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Give your child a confident start—with global tutors who make learning fun
            </h1>
            <p className="text-lg text-gray-100">
              From phonetics and diction to homework help and exam prep, we pair students with expertly vetted tutors who
              personalize every lesson.
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
          <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-xl border border-white/20 space-y-6">
            <h2 className="text-2xl font-bold text-maroon">What your child will learn</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Strong phonics, reading fluency, and confident speaking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Math foundations, problem-solving, and critical thinking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Homework strategies and organized study routines</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Creative expression through writing, presentations, and projects</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6 space-y-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-maroon font-semibold">Why parents choose us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Vetted tutors. Clear results.</h2>
            <p className="text-gray-700">
              Every tutor is screened for subject expertise, child-friendly delivery, and reliable availability. We monitor
              sessions, share progress, and adjust quickly based on parent feedback.
            </p>
            <ul className="space-y-2 text-gray-800">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">
                    <i className="fa-solid fa-check-circle" aria-hidden="true" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-3">
                <div className="text-2xl text-maroon">
                  <i className={`fa-solid ${pillar.icon}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-black">{pillar.title}</h3>
                <p className="text-gray-700 text-sm">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-maroon font-semibold">Next steps</p>
              <h3 className="text-2xl font-bold text-black">Book a demo lesson or speak to a representative</h3>
              <p className="text-gray-700">
                Tell us about your child’s needs; we’ll propose a tutor match, schedule a demo, and share a plan to boost
                performance at school.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={calendarLink}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-maroon text-white px-5 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
              >
                Schedule now
                <i className="fa-solid fa-calendar-plus" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 border border-maroon text-maroon px-5 py-3 rounded-lg font-semibold hover:bg-cream transition-colors"
              >
                Create account
                <i className="fa-solid fa-user-plus" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
