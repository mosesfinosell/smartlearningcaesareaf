import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Globe, Video, TrendingUp, Award } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-brand-off-white border-b border-brand-light-gold">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-brand-gold text-2xl font-bold">
                CAESAREA SMART SCHOOL
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-brand-dark-grey hover:text-brand-gold transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-brand-dark-grey hover:text-brand-gold transition-colors">
                About
              </Link>
              <Link href="/subjects" className="text-brand-dark-grey hover:text-brand-gold transition-colors">
                Subjects
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-brand-cream py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-brand-warm-grey mb-4 text-sm font-semibold tracking-wide uppercase">
                Educating Globally. Raising Globally-Competent Children.
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-charcoal mb-6 leading-tight">
                World-Class Online Education with Certified Global Tutors
              </h1>
              <p className="text-lg text-brand-warm-grey mb-8 leading-relaxed">
                US, UK & Nigerian Curriculum • Live Classes • Flexible Scheduling • Professional Tutors
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-brand-gold/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="aspect-video bg-brand-gold/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-24 h-24 text-brand-gold mx-auto mb-4" />
                    <p className="text-brand-dark-grey font-semibold">
                      Professional Learning Environment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Active Students' },
              { number: '50+', label: 'Expert Tutors' },
              { number: '15+', label: 'Countries' },
              { number: '95%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-brand-gold mb-2">{stat.number}</div>
                <div className="text-brand-warm-grey">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-brand-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose Caesarea Smart School?</h2>
            <p className="section-subtitle">
              Providing world-class education that prepares students for global success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-12 h-12 text-brand-gold" />,
                title: 'Global Standards',
                description: 'US, UK & Nigerian curriculum options to match your goals',
              },
              {
                icon: <Users className="w-12 h-12 text-brand-gold" />,
                title: 'Verified Tutors',
                description: '7-Stage verification process ensures quality educators',
              },
              {
                icon: <Video className="w-12 h-12 text-brand-gold" />,
                title: 'Live Classes',
                description: 'Interactive sessions with recordings for revision',
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-brand-gold" />,
                title: 'Track Progress',
                description: 'Real-time reports and parent dashboard',
              },
              {
                icon: <Award className="w-12 h-12 text-brand-gold" />,
                title: 'Flexible Learning',
                description: 'Learn from anywhere at your convenience',
              },
              {
                icon: <BookOpen className="w-12 h-12 text-brand-gold" />,
                title: 'Affordable',
                description: 'Quality education starting from ₦10,000/month',
              },
            ].map((feature, i) => (
              <Card key={i} className="card-hover border-brand-light-gold">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Curriculum Options</h2>
            <p className="section-subtitle">
              Choose the curriculum that matches your educational goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'US Curriculum',
                subjects: ['Math', 'English', 'Science', 'Social Studies', 'Coding'],
                exams: 'SAT Preparation',
              },
              {
                title: 'UK Curriculum',
                subjects: ['Maths', 'English', 'Science', 'Languages', 'ICT'],
                exams: 'IGCSE / GCSE',
              },
              {
                title: 'Nigerian Curriculum',
                subjects: ['Mathematics', 'English', 'Sciences', 'Civics', 'Languages'],
                exams: 'JAMB / WAEC',
              },
            ].map((curriculum, i) => (
              <Card key={i} className="card-hover">
                <CardHeader>
                  <CardTitle className="text-2xl text-brand-gold">
                    {curriculum.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-brand-dark-grey">
                        Core Subjects:
                      </h4>
                      <ul className="space-y-1">
                        {curriculum.subjects.map((subject, j) => (
                          <li key={j} className="text-brand-warm-grey">
                            • {subject}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark-grey">
                        Exam Prep:
                      </h4>
                      <p className="text-brand-warm-grey">{curriculum.exams}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-gold text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of students learning with Caesarea Smart School
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-brand-gold hover:bg-brand-cream">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-brand-gold">
                CAESAREA SMART SCHOOL
              </h3>
              <p className="text-sm opacity-80">
                A Division of Caesarea Schools
              </p>
              <p className="text-sm opacity-80 mt-2">
                Educating globally. Raising Globally-Competent Children.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                <li><Link href="/subjects" className="hover:text-brand-gold transition-colors">Subjects</Link></li>
                <li><Link href="/tutors" className="hover:text-brand-gold transition-colors">Become a Tutor</Link></li>
                <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>info@caesareasmartschool.com</li>
                <li>+234 XXX XXX XXXX</li>
                <li>Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-warm-grey/30 pt-8 text-center text-sm opacity-80">
            © 2025 Caesarea Smart School. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
