'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="bg-maroon text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-gold">Caesarea</div>
              <div className="text-sm">
                <div className="font-semibold">Smart School</div>
                <div className="text-xs text-gold">Online Learning Platform</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="hover:text-gold transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-gold transition-colors">How It Works</Link>
              <Link href="#about" className="hover:text-gold transition-colors">About</Link>
              <Link href="/login">
                <button className="bg-gold text-maroon px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-white text-maroon px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <Link href="#features" className="block hover:text-gold transition-colors">Features</Link>
              <Link href="#how-it-works" className="block hover:text-gold transition-colors">How It Works</Link>
              <Link href="#about" className="block hover:text-gold transition-colors">About</Link>
              <Link href="/login" className="block">
                <button className="w-full bg-gold text-maroon px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/register" className="block">
                <button className="w-full bg-white text-maroon px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-maroon via-red-900 to-maroon text-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Education with
                <span className="text-gold"> Smart Learning</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Connect students, parents, and expert tutors in one comprehensive online learning platform. 
                Quality education, accessible anywhere, anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <button className="bg-gold text-maroon px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg">
                    Start Learning Today
                  </button>
                </Link>
                <Link href="#how-it-works">
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-opacity-30 transition-colors">
                    Learn More →
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <StatBox number="500+" label="Active Students" icon="🎓" />
                  <StatBox number="100+" label="Expert Tutors" icon="👨‍🏫" />
                  <StatBox number="50+" label="Subjects" icon="📚" />
                  <StatBox number="98%" label="Success Rate" icon="⭐" />
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
            <h2 className="text-4xl font-bold text-maroon mb-4">Why Choose Caesarea?</h2>
            <p className="text-xl text-gray-600">Everything you need for a complete learning experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Personalized Learning"
              description="Tailored curriculum and one-on-one attention from expert tutors matched to your needs and learning style."
            />
            <FeatureCard
              icon="💳"
              title="Flexible Payments"
              description="Secure wallet system with multiple payment options. Pay per class or subscribe monthly with ease."
            />
            <FeatureCard
              icon="📊"
              title="Progress Tracking"
              description="Comprehensive reports and analytics to monitor student performance, attendance, and achievements."
            />
            <FeatureCard
              icon="📹"
              title="Live Video Classes"
              description="Interactive online classes with screen sharing, breakout rooms, and recorded sessions for review."
            />
            <FeatureCard
              icon="✍️"
              title="Smart Assignments"
              description="Auto-graded assignments with instant feedback, detailed analytics, and progress monitoring."
            />
            <FeatureCard
              icon="💬"
              title="Direct Communication"
              description="Built-in messaging system connecting parents, students, and tutors for seamless collaboration."
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
              icon="🎓"
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
              icon="👨‍👩‍👧"
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
              icon="👨‍🏫"
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
            Join thousands of students, parents, and tutors already using Caesarea Smart School
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
              <h3 className="text-xl font-bold text-gold mb-4">Caesarea Smart School</h3>
              <p className="text-gray-400">
                Transforming education through innovative online learning solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-gold">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-gold">How It Works</Link></li>
                <li><Link href="/register" className="hover:text-gold">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-gold">Help Center</Link></li>
                <li><Link href="#" className="hover:text-gold">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-gold">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-gold">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-gold">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Caesarea Smart School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatBox({ number, label, icon }: { number: string; label: string; icon: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{number}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-maroon mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
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

function UserTypeCard({ icon, title, benefits, cta, link }: { icon: string; title: string; benefits: string[]; cta: string; link: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gold">
      <div className="text-6xl mb-4 text-center">{icon}</div>
      <h3 className="text-2xl font-bold text-maroon mb-6 text-center">{title}</h3>
      <ul className="space-y-3 mb-8">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
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
