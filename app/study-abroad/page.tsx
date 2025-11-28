import type { Metadata } from 'next';
import Link from 'next/link';

const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';

export const metadata: Metadata = {
  title: 'Study Abroad | SmartLearning by Caesarea College',
  description:
    'End-to-end study abroad support: course selection, applications, scholarships, and visa guidance for US, UK, Canada, and Australia.',
};

export default function StudyAbroadPage() {
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
            <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">Study abroad</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Your pathway to the US, UK, Canada, and Australia</h1>
            <p className="text-lg text-gray-100">
              Get guided through university selection, applications, scholarships, and visa documentation with advisors who
              know each country’s requirements.
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
            <h2 className="text-2xl font-bold text-maroon">How we help</h2>
            <ul className="space-y-2 text-gray-800">
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Profile review and shortlist of best-fit universities and colleges.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Application coaching for statements, recommendations, and timelines.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Scholarship guidance and documentation checks to improve acceptance.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Visa preparation: forms, interviews, and financial proof support.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Post-admission onboarding and travel readiness checklist.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-14 px-6 grid md:grid-cols-3 gap-6">
        {[
          { title: 'Country Playbooks', desc: 'UK personal statements, Canadian SDS, US essays, and Australian GTE guidance.' },
          { title: 'Testing & Docs', desc: 'IELTS/TOEFL prep, credential evaluation, financial docs, and CAS/LOA readiness.' },
          { title: 'Scholarships & Funding', desc: 'Shortlist scholarships, fee waivers, and merit/need-based options to reduce costs.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-black">{item.title}</h3>
            <p className="text-gray-700 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
