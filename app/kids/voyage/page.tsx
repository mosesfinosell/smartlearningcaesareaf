import type { Metadata } from 'next';
import Link from 'next/link';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'Virtual Voyage Program | SmartLearning Kids',
  description:
    'A virtual journey around the world for kids aged 7–17—immersive lessons on culture, geography, landmarks, and global citizenship.',
};

export default function GlobalVoyagePage() {
  const learnList = [
    'Famous countries and cities',
    'Landmarks & world wonders',
    'Languages & greetings',
    'Food, music & daily lifestyle',
    'Maps, climates & landscapes',
    'Traditions & festivals',
    'Wildlife & natural wonders',
    'Travel knowledge & global safety',
    'People, population & economy',
    'Historic events and world heritage sites',
  ];

  const skills = [
    'Global awareness',
    'Curiosity & creativity',
    'Geography & map-reading',
    'Communication & presentation',
    'Critical thinking',
    'Research and discovery',
    'Appreciation for diversity',
    'Confidence in navigating a globalized world',
  ];

  return (
    <main className="bg-cream min-h-screen text-gray-900">
      <nav className="bg-white text-maroon shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-start gap-2">
            <div className="text-3xl font-bold leading-none">SmartLearning</div>
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
            <Link href="/kids" className="text-maroon font-semibold hover:underline inline-flex items-center gap-1">
              <span aria-hidden="true">←</span>
              <span>Back to Kids</span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-maroon to-black text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">Virtual Voyage Program</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">A virtual journey around the world</h1>
            <p className="text-lg text-gray-100">
              Immersive, moderated adventures to cultural landmarks, ancient sites, and museums—helping kids think and act
              like global citizens.
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
            <h2 className="text-2xl font-bold text-maroon">Why parents love it</h2>
            <ul className="space-y-2 text-gray-800">
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Builds international intelligence with real-world context.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Boosts curiosity, confidence, and communication through guided interactions.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Enhances school performance in geography, history, and cultural literacy.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Led by geographers, explorers, and travel enthusiasts with firsthand experience.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Safe, moderated lessons designed for ages 7–17 with interactive visuals.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-14 px-6 space-y-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-black">What your child will learn</h2>
            <p className="text-gray-700">
              Weekly exploration themes cover the world’s landmarks, cultures, and environments. Each lesson ends with a
              short activity or virtual “passport stamp” to track their journey.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {learnList.map((item) => (
                <div key={item} className="bg-white rounded-lg border border-gray-200 p-3 text-sm text-gray-800">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-black">Digital Global Voyager Passport</h3>
            <p className="text-gray-700">
              Every learner collects stamps as they “visit” new countries, building motivation, reflection, and a sense of
              adventure.
            </p>
            <h4 className="text-lg font-semibold text-maroon mt-4">Skills they develop</h4>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-800">
              {skills.map((skill) => (
                <li key={skill} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">
                    <i className="fa-solid fa-check-circle" aria-hidden="true" />
                  </span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
          <h3 className="text-2xl font-bold text-black">How the program works</h3>
          <ul className="space-y-2 text-gray-800">
            <li>Live weekly virtual classes with world-class instructors.</li>
            <li>Interactive visual lessons (videos, maps, virtual tours) and real-time Q&A.</li>
            <li>Digital passport & activities with monthly global challenges and projects.</li>
            <li>Flexible schedules to support learners across multiple time zones.</li>
          </ul>
          <h4 className="text-lg font-semibold text-maroon mt-3">Who it’s for</h4>
          <p className="text-gray-700">
            Curious learners aged 7–17 interested in geography, travel, cultures, or preparing for international education.
          </p>
        </div>
      </section>

      <section className="bg-maroon text-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.18em] text-gold font-semibold">Enroll your child today</p>
          <h2 className="text-3xl font-bold">Give them a passport to lifelong global confidence</h2>
          <p className="text-gray-100 max-w-3xl mx-auto">
            Let your child travel the world without leaving home. A world of discovery awaits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Link
              href={calendarLink}
              target="_blank"
              rel="noopener"
              className="bg-gold text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Join the Global Voyage Program
            </Link>
            <Link
              href="/kids"
              className="border border-white/40 px-6 py-3 rounded-lg font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View all kids programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
