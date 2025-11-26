'use client';

import Link from 'next/link';
import { useState, ReactNode } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-white text-maroon shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
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
                href="#features"
                className="relative inline-flex items-center hover:text-maroon transition-colors pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="relative inline-flex items-center hover:text-maroon transition-colors pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="relative inline-flex items-center hover:text-maroon transition-colors pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                About
              </Link>
              <Link href="/login">
                <button className="bg-white text-gold border border-gold px-6 py-2 rounded-lg font-semibold hover:bg-gold hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-white text-maroon border border-maroon px-6 py-2 rounded-lg font-semibold hover:bg-maroon hover:text-white transition-colors">
                  Get Started
                </button>
              </Link>
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
                href="#features"
                className="relative inline-flex items-center hover:text-maroon transition-colors text-black pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="relative inline-flex items-center hover:text-maroon transition-colors text-black pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                How It Works
              </Link>
              <Link
                href="/about"
                className="relative inline-flex items-center hover:text-maroon transition-colors text-black pr-4 after:content-[''] after:absolute after:right-0 after:top-1/4 after:bottom-1/4 after:w-px after:bg-red-600"
              >
                About
              </Link>
              <Link href="/login" className="block">
                <button className="w-full bg-white text-gold border border-gold px-6 py-2 rounded-lg font-semibold hover:bg-gold hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/register" className="block">
                <button className="w-full bg-white text-maroon border border-maroon px-6 py-2 rounded-lg font-semibold hover:bg-maroon hover:text-white transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white text-maroon py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slide-in-left motion-reduce:animate-none">
                Transform Education with{' '}
                <span className="text-black">SmartLearning</span> by Caesarea College
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
                <Link href="#how-it-works">
                  <button className="border-2 border-maroon text-maroon px-8 py-4 rounded-lg text-lg font-bold hover:bg-cream transition-colors">
                    Learn More →
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
              title="Live Video Classes"
              description="Interactive classes run like a real campus—screen sharing, breakout rooms, and recordings for review."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-pen-to-square" aria-hidden="true" />}
              title="Smart Assignments"
              description="Assignments built to rigorous school standards with instant feedback and clear performance analytics."
            />
            <FeatureCard
              icon={<i className="fa-solid fa-comments" aria-hidden="true" />}
              title="Direct Communication"
              description="Built-in communication that keeps parents, students, tutors, and administrators aligned."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-maroon mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Create Your Account"
              description="Sign up as a student, parent, or tutor. Complete your profile with relevant information and preferences."
            />
            <StepCard
              number="2"
              title="Find Perfect Match"
              description="Browse verified tutors, view their ratings and expertise. Enroll in classes that fit your schedule and goals."
            />
            <StepCard
              number="3"
              title="Start Learning"
              description="Join live classes, complete assignments, track progress, and achieve your academic goals with expert guidance."
            />
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

      {/* CTA Section */}
      <section className="bg-maroon text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of students, parents, and tutors already using SmartLearning by Caesarea College
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-gold text-maroon px-10 py-4 rounded-lg text-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg">
                Get Started Free
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-opacity-30 transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-black mb-4">SmartLearning by Caesarea College</h3>
              <p className="text-gray-400">
                Transforming education through innovative online learning solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-maroon">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-maroon">How It Works</Link></li>
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
                <li><Link href="#" className="hover:text-maroon">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-maroon">Terms of Service</Link></li>
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

function StatBox({ number, label, icon }: { number: string; label: string; icon: ReactNode }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-2 text-gray-600 [&>*]:align-middle">{icon}</div>
      <div className="text-3xl font-bold mb-1 text-gray-700">{number}</div>
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
