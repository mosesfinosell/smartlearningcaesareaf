'use client';

import Link from 'next/link';

export default function AboutPage() {
  const board = [
    { name: 'Board Member A', role: 'Chair, Educational Strategy & Standards' },
    { name: 'Board Member B', role: 'Director, School Operations & Compliance' },
    { name: 'Board Member C', role: 'Director, Curriculum & Pedagogy' },
    { name: 'Board Member D', role: 'Director, Student Development & Welfare' },
  ];

  return (
    <div className="min-h-screen bg-cream text-maroon">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">About SmartLearning</h1>
            <p className="text-gray-600">SmartLearning by Caesarea College</p>
          </div>
          <Link href="/" className="text-maroon font-semibold hover:underline">
            ← Back home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <section className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-3">Our Foundation</h2>
          <p className="text-gray-700">
            SmartLearning is built and overseen by an experienced educational management board from Caesarea College,
            bringing hands-on expertise from running physical schools into a structured online environment.
          </p>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-3">What We Deliver</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Structured systems that mirror on-campus governance and academics.</li>
            <li>Transparent processes for enrollment, communications, and reporting.</li>
            <li>Dedicated support for students, parents, tutors, and administrators.</li>
          </ul>
        </section>

        <section id="board" className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-3">Board of Governance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {board.map((member) => (
              <div key={member.role} className="p-4 border border-gray-100 rounded-lg shadow-xs bg-cream text-left flex flex-col items-start">
                <div className="w-24 h-32 rounded-lg bg-gradient-to-br from-maroon to-gold text-white text-3xl font-bold flex items-center justify-center mb-3">
                  {member.name[0]}
                </div>
                <p className="font-semibold text-maroon">{member.name}</p>
                <p className="text-sm text-gray-600 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
