import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Built for Everyone | SmartLearning',
  description: 'Tailored experiences for students, parents, and tutors with focused benefits and clear next steps.',
};

const userTypes = [
  {
    title: 'For Students',
    icon: 'fa-user-graduate',
    benefits: [
      'Access to expert tutors',
      'Interactive live classes',
      'Track your progress',
      'Submit assignments online',
      'Get instant feedback',
    ],
    cta: 'Start Learning',
    link: '/register',
  },
  {
    title: 'For Parents',
    icon: 'fa-people-roof',
    benefits: [
      'Monitor child progress',
      'Communicate with tutors',
      'Secure payment system',
      'View detailed reports',
      'Manage multiple children',
    ],
    cta: 'Join as Parent',
    link: '/register',
  },
  {
    title: 'For Tutors',
    icon: 'fa-chalkboard-user',
    benefits: [
      'Reach more students',
      'Manage classes easily',
      'Auto-grade assignments',
      'Flexible scheduling',
      'Secure earnings',
    ],
    cta: 'Become a Tutor',
    link: '/register',
  },
];

export default function AudiencesPage() {
  return (
    <main className="min-h-screen bg-cream text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-maroon font-semibold">Built for everyone</p>
            <h1 className="text-3xl md:text-4xl font-bold text-maroon">Tailored experiences for each user type</h1>
            <p className="text-gray-600">Students, parents, and tutors each get flows designed for their goals.</p>
          </div>
          <Link href="/" className="text-maroon font-semibold hover:underline inline-flex items-center gap-1">
            <span aria-hidden="true">←</span>
            <span>Back home</span>
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((user) => (
            <div key={user.title} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gold/20">
              <div className="text-5xl mb-4 text-maroon text-center">
                <i className={`fa-solid ${user.icon}`} aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-maroon text-center mb-6">{user.title}</h2>
              <ul className="space-y-3 mb-8 text-gray-700">
                {user.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">
                      <i className="fa-solid fa-check" aria-hidden="true" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <Link
                  href={user.link}
                  className="inline-flex items-center gap-2 bg-maroon text-white px-5 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
                >
                  {user.cta}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
