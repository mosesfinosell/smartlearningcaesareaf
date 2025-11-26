'use client';

import Link from 'next/link';

const courses = [
  { title: 'STEM Foundations', desc: 'Math, science, and technology tracks with live labs and project work.' },
  { title: 'Languages & Global Studies', desc: 'English, French, and global awareness modules for diverse learners.' },
  { title: 'Creative Arts & Media', desc: 'Design, storytelling, and digital media with portfolio-driven assessments.' },
  { title: 'Leadership & Civic Engagement', desc: 'Public speaking, debate, and service-learning guided by educators.' },
];

export default function FeaturedCoursesPage() {
  return (
    <div className="min-h-screen bg-cream text-maroon">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Featured Courses</h1>
            <p className="text-gray-600">Programs curated by the SmartLearning board</p>
          </div>
          <Link href="/" className="text-maroon font-semibold hover:underline">
            ← Back home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <section className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-700">
            Explore courses shaped by experienced school administrators, balancing rigor with flexibility for a global audience.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.title} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-bold text-maroon mb-2">{course.title}</h2>
              <p className="text-gray-700">{course.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
