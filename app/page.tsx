'use client';

import Link from 'next/link';
import { FocusEvent, ReactNode, useEffect, useRef, useState } from 'react';

const featuredCategories = [
  {
    title: 'K-12 Academics',
    items: [
      'Home Tutoring',
      'Common Entrance',
      'IGCSE/GCSE Prep',
      'Homework Help',
      'Homeschooling',
      'UTME Prep',
      'BECE',
      'WAEC/NECO',
    ],
  },
  {
    title: 'Tests & Exams',
    items: ['IELTS Prep', 'GMAT Prep', 'GRE Prep', 'SATs Prep', 'ACTs Prep', 'Study Abroad', 'TEF & DELF'],
  },
  {
    title: 'Languages',
    items: ['French Lessons', 'Yoruba Lessons', 'Hausa Lessons', 'Chinese Lessons', 'Igbo Lessons', 'German Lessons'],
  },
  {
    title: 'Music',
    items: ['Piano Lessons', 'Guitar Lessons', 'Music Theory', 'Saxophone Lessons', 'Violin Lessons'],
  },
  {
    title: 'Kids',
    items: ['Global Tutors', 'Phonetics & Diction', 'Homework Help', 'Boost School Performance'],
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || process.env.CALENDAR_LINK || '#';
  const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/';
  const callNumber = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+0000000000';
  const emailAddress = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@smartlearning.com';
  const socialLinks = {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#',
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '#',
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#',
  };

  const handleFeaturedBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next || !event.currentTarget.contains(next)) {
      setFeaturedOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-white text-maroon shadow-md border-b border-gray-200 relative z-20">
        <div className="max-w-7xl mx-auto px-8 py-4 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-2">
              <div className="text-3xl font-bold text-maroon leading-none">SmartLearning</div>
              <div className="text-[10px] leading-3 text-black translate-y-[-6px]">
                <div>Caesarea College</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4 text-black">
              <Link
                href="/about#board"
                className="relative inline-flex items-center hover:text-maroon transition-colors pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                Board of Governance
              </Link>
              <div
                className="relative group"
                onMouseEnter={() => setFeaturedOpen(true)}
                onMouseLeave={() => setFeaturedOpen(false)}
                onFocus={() => setFeaturedOpen(true)}
                onBlur={handleFeaturedBlur}
              >
                <Link
                  href="/featured-courses"
                  className="relative inline-flex items-center gap-2 hover:text-maroon transition-colors pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
                >
                  Featured Courses
                  <i
                    className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${featuredOpen ? 'rotate-180 text-maroon' : ''}`}
                    aria-hidden="true"
                  />
                </Link>

                <div
                  onMouseEnter={() => setFeaturedOpen(true)}
                  className={`absolute left-1/2 -translate-x-[65%] top-full pt-4 w-[900px] max-w-[calc(100vw-2rem)] transition-all duration-200 z-30 ${
                    featuredOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                      <i className="fa-solid fa-magnifying-glass text-gray-400" aria-hidden="true" />
                      <input
                        type="text"
                        readOnly
                        placeholder="What do you want to learn?"
                        className="w-full bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none cursor-default"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {featuredCategories.map((category) => (
                        <div key={category.title} className="space-y-3">
                          <h4 className="font-semibold text-gray-800">{category.title}</h4>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            {category.items.map((item) => (
                              <li key={item}>
                                <Link
                                  href={category.title === 'Kids' ? '/kids' : '/featured-courses'}
                                  className="hover:text-maroon transition-colors inline-flex"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/about"
                className="relative inline-flex items-center hover:text-maroon transition-colors pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                About
              </Link>
              <a
                href={calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-maroon border border-maroon px-6 py-2 rounded-lg font-semibold hover:bg-maroon hover:text-white transition-colors"
              >
                Book a Call
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-maroon"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
            {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <Link
                href="/about#board"
                className="relative inline-flex items-center hover:text-maroon transition-colors text-black pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                Board of Governance
              </Link>
              <Link
                href="/featured-courses"
                className="relative inline-flex items-center hover:text-maroon transition-colors text-black pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                Featured Courses
              </Link>
              <Link
                href="/about"
                className="relative inline-flex items-center hover:text-maroon transition-colors text-black pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                About
              </Link>
              <Link
                href="/kids"
                className="relative inline-flex items-center hover:text-maroon transition-colors text-black pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                Kids
              </Link>
              <a
                href={calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-maroon border border-maroon px-6 py-2 rounded-lg font-semibold hover:bg-maroon hover:text-white transition-colors text-center"
              >
                Book a Call
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white text-maroon py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
                Transform Education with{' '}
                <span className="text-maroon-dark">SmartLearning</span> by Caesarea College
              </h1>
              <p className="text-base md:text-lg mb-8 text-gray-700">
                Making quality education accessible through a structured model, blending hands-on school expertise with global diversity in mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <button className="bg-white text-gray-700 border-2 border-gold px-8 py-4 rounded-lg text-lg font-bold hover:bg-gold hover:text-white transition-colors shadow-lg">
                    Start Learning Today
                  </button>
                </Link>
                <Link href="/featured-courses">
                  <button className="border-2 border-maroon text-maroon px-8 py-4 rounded-lg text-lg font-bold hover:bg-cream transition-colors">
                    Featured Courses →
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-cream border border-maroon-light/20 rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <StatBox number="500+" label="Active Students" icon={<i className="fa-solid fa-user-graduate" aria-hidden="true" />} />
                  <StatBox number="100+" label="Expert Tutors" icon={<i className="fa-solid fa-chalkboard-user" aria-hidden="true" />} />
                  <StatBox number="50+" label="Subjects" icon={<i className="fa-solid fa-book-open" aria-hidden="true" />} />
                  <StatBox number="98%" label="Success Rate" icon={<i className="fa-solid fa-star" aria-hidden="true" />} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-maroon mb-4">Why Choose SmartLearning?</h2>
            <p className="text-xl text-gray-600">
              Structured systems led by an experienced educational management board with hands-on physical school expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<i className="fa-solid fa-shield-check" aria-hidden="true" />}
              title="Regulated & Certified Tutors"
              description="Every tutor is vetted, certified, and aligned to standards set by seasoned school administrators."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-wallet" aria-hidden="true" />}
              title="Operational Clarity"
              description="Governance and policies set by seasoned school administrators, keeping processes as clear as an on-campus experience."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-chart-line" aria-hidden="true" />}
              title="Structured Management"
              description="Structured systems led by an experienced educational management board with hands-on physical school expertise."
              extra={
                <Link href="/about#board" className="inline-flex items-center gap-2 text-maroon font-semibold hover:underline">
                  <span>View directors</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                </Link>
              }
            />
            <FeatureCard
              icon={<i className="fa-solid fa-video" aria-hidden="true" />}
              title="Properly Vetted Tutors"
              description="Every tutor is rigorously screened, interviewed, and monitored to deliver reliable, high-quality learning experiences."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-pen-to-square" aria-hidden="true" />}
              title="Global Diversity in Education"
              description="Structured learning experiences designed for diverse cultures, time zones, and learning needs—while keeping rigorous standards."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-comments" aria-hidden="true" />}
              title="Direct Communication"
              description="Built-in communication that keeps parents, students, tutors, and administrators aligned, with direct channels to share feedback and decisions with the management team."
            />
          </div>
        </div>
      </section>

      {/* Study Abroad Section */}
      <section id="featured-courses" className="bg-gradient-to-br from-cream via-white to-cream py-20 px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col gap-4 max-w-4xl">
            <p className="text-sm font-semibold text-gold uppercase tracking-[0.18em]">Admissions & Travels</p>
            <h2 className="text-4xl md:text-5xl font-bold text-maroon leading-tight">
              Study abroad. Simplified.
            </h2>
            <p className="text-xl text-gray-700">
              From courses to countries, find what you need in a moment.
            </p>
            <p className="text-base md:text-lg text-gray-700">
              We prepare students for IGCSE and Cambridge exams, then guide applications through our partner network with
              access to 750+ institutions worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-r from-maroon-dark to-maroon rounded-3xl p-10 shadow-xl text-white relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-gold opacity-20 rounded-full blur-3xl" />
              <div className="absolute -left-10 -top-10 w-64 h-64 bg-gold opacity-10 rounded-full blur-3xl" />
              <div className="relative space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                  Apply to universities and colleges across the US, UK, Canada, and Australia.
                </h3>
                <p className="text-lg text-gold-light">
                  Get expert help to study abroad with ease—from course selection to visa processing.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-gold"><i className="fa-solid fa-check-circle" aria-hidden="true" /></span>
                    <span className="text-gray-100">98% admission success rate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-gold"><i className="fa-solid fa-check-circle" aria-hidden="true" /></span>
                    <span className="text-gray-100">Tuition scholarships starting from 40%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-gold"><i className="fa-solid fa-check-circle" aria-hidden="true" /></span>
                    <span className="text-gray-100">Hassle-free student visa processing</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/featured-courses"
                    className="inline-flex items-center gap-2 bg-gold text-maroon font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gold-light transition-colors"
                  >
                    Explore pathways
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                  <Link
                    href={calendarLink}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 border border-gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-maroon transition-colors"
                  >
                    Get started
                    <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Meet</p>
                <h4 className="text-3xl font-bold text-maroon">
                  <CountUp value={750} suffix="+" />
                </h4>
                <p className="text-gray-600">Institutions around the world</p>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Courses</p>
                <h4 className="text-3xl font-bold text-maroon">
                  <CountUp value={42245} />
                </h4>
                <p className="text-gray-600">Programs to match your goals</p>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Universities</p>
                <h4 className="text-3xl font-bold text-maroon">
                  <CountUp value={365} />
                </h4>
                <p className="text-gray-600">Top destinations we place students into</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-cream to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-maroon mb-4">Built For Everyone</h2>
            <p className="text-xl text-gray-600">Tailored experiences for each user type</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <UserTypeCard
              icon={<i className="fa-solid fa-user-graduate" aria-hidden="true" />}
              title="For Students"
              benefits={[
                'Access to expert tutors',
                'Interactive live classes',
                'Track your progress',
                'Submit assignments online',
                'Get instant feedback'
              ]}
              cta="Start Learning"
              link="/register"
            />
            <UserTypeCard
              icon={<i className="fa-solid fa-people-roof" aria-hidden="true" />}
              title="For Parents"
              benefits={[
                'Monitor child progress',
                'Communicate with tutors',
                'Secure payment system',
                'View detailed reports',
                'Manage multiple children'
              ]}
              cta="Join as Parent"
              link="/register"
            />
            <UserTypeCard
              icon={<i className="fa-solid fa-chalkboard-user" aria-hidden="true" />}
              title="For Tutors"
              benefits={[
                'Reach more students',
                'Manage classes easily',
                'Auto-grade assignments',
                'Flexible scheduling',
                'Secure earnings'
              ]}
              cta="Become a Tutor"
              link="/register"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-maroon text-white py-20 px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <p className="uppercase tracking-[0.2em] text-gold text-sm font-semibold">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Speak to our representative, start learning, make progress
          </h2>
          <p className="text-lg text-gray-200">
            We listen to your goals, match you with properly vetted tutors, and guide you from the first demo to steady results.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white text-gray-900 rounded-xl p-8 shadow-lg space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-maroon text-white text-xl font-bold">
              1
            </div>
            <h3 className="text-2xl font-semibold text-black">Speak to our representative</h3>
            <p className="text-gray-700">
              We hear your concerns about you or your ward, then recommend the right tutors, demo classes, and learning path.
            </p>
          </div>
          <div className="bg-white text-gray-900 rounded-xl p-8 shadow-lg space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-maroon text-white text-xl font-bold">
              2
            </div>
            <h3 className="text-2xl font-semibold text-black">Start learning</h3>
            <p className="text-gray-700">
              Begin sessions with vetted tutors, use structured resources, and settle into a rhythm that fits your schedule.
            </p>
          </div>
          <div className="bg-white text-gray-900 rounded-xl p-8 shadow-lg space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-maroon text-white text-xl font-bold">
              3
            </div>
            <h3 className="text-2xl font-semibold text-black">Make progress</h3>
            <p className="text-gray-700">
              Track improvements, review recorded sessions, and adjust plans with your representative to keep momentum high.
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 bg-gold text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            <i className="fa-brands fa-whatsapp" aria-hidden="true" />
            WhatsApp a representative
          </Link>
          <a
            href={`tel:${callNumber}`}
            className="inline-flex items-center justify-center gap-2 bg-white text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-white/30"
          >
            <i className="fa-solid fa-phone" aria-hidden="true" />
            Call us
          </a>
          <a
            href={`mailto:${emailAddress}`}
            className="inline-flex items-center justify-center gap-2 bg-white text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-white/30"
          >
            <i className="fa-solid fa-envelope" aria-hidden="true" />
            Email us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gold mb-4">SmartLearning by Caesarea College</h3>
              <p className="text-gray-400">
                Transforming education through innovative online learning solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-maroon">Features</Link></li>
                <li><Link href="/featured-courses" className="hover:text-maroon">Featured Courses</Link></li>
                <li><Link href="/blog" className="hover:text-maroon">Blog</Link></li>
                <li><Link href="/register" className="hover:text-maroon">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-maroon">Help Center</Link></li>
                <li><Link href="#" className="hover:text-maroon">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-maroon">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/legal/legal-center.pdf" target="_blank" rel="noopener" className="hover:text-maroon">
                    Legal Center
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy-policy.pdf" target="_blank" rel="noopener" className="hover:text-maroon">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookie-policy.pdf" target="_blank" rel="noopener" className="hover:text-maroon">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/legal-notice.pdf" target="_blank" rel="noopener" className="hover:text-maroon">
                    Legal Notice
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href={socialLinks.facebook} target="_blank" rel="noopener" className="hover:text-maroon inline-flex items-center gap-2">
                    <i className="fa-brands fa-facebook" aria-hidden="true" />
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href={socialLinks.instagram} target="_blank" rel="noopener" className="hover:text-maroon inline-flex items-center gap-2">
                    <i className="fa-brands fa-instagram" aria-hidden="true" />
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href={socialLinks.linkedin} target="_blank" rel="noopener" className="hover:text-maroon inline-flex items-center gap-2">
                    <i className="fa-brands fa-linkedin" aria-hidden="true" />
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href={socialLinks.youtube} target="_blank" rel="noopener" className="hover:text-maroon inline-flex items-center gap-2">
                    <i className="fa-brands fa-youtube" aria-hidden="true" />
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartLearning by Caesarea College. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CountUp({ value, suffix = '', duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const current = Math.floor(progress * value);
      setDisplay(current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, hasStarted]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatBox({ number, label, icon }: { number: string; label: string; icon: ReactNode }) {
  const numericValue = parseFloat(number.replace(/[^0-9.]/g, '')) || 0;
  const suffix = number.replace(/[0-9.,]/g, '');

  return (
    <div className="text-center">
      <div className="text-3xl mb-2 text-gray-600 [&>*]:align-middle">{icon}</div>
      <div className="text-3xl font-bold mb-1 text-gray-700">
        <CountUp value={numericValue} suffix={suffix} />
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, extra }: { icon: ReactNode; title: string; description: string; extra?: ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="text-5xl mb-4 text-black [&>*]:align-middle">{icon}</div>
      <h3 className="text-xl font-bold text-maroon mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gold text-maroon rounded-full text-2xl font-bold mb-6">
        {number}
      </div>
      <h3 className="text-2xl font-bold text-maroon mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function UserTypeCard({ icon, title, benefits, cta, link }: { icon: ReactNode; title: string; benefits: string[]; cta: string; link: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gold">
      <div className="text-6xl mb-4 text-center text-black [&>*]:align-middle">{icon}</div>
      <h3 className="text-2xl font-bold text-maroon mb-6 text-center">{title}</h3>
      <ul className="space-y-3 mb-8">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-green-600 mt-1">
              <i className="fa-solid fa-check" aria-hidden="true" />
            </span>
            <span className="text-gray-700">{benefit}</span>
          </li>
        ))}
      </ul>
      <Link href={link}>
        <button className="w-full bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors">
          {cta}
        </button>
      </Link>
    </div>
  );
}
