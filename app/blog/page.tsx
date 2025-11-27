import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchArticles } from './articles';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const canonicalUrl = `${siteUrl}/blog`;
const logoImage = '/images/smartlearninglogo.jpeg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'SmartLearning Blog | Insights for Students, Parents, and Tutors',
  description:
    'Actionable guides on study habits, online tutoring, academic planning, and digital learning tools from SmartLearning by Caesarea College.',
  keywords: [
    'SmartLearning blog',
    'online learning tips',
    'tutoring strategies',
    'study habits',
    'parent engagement in education',
    'edtech insights',
    'exam preparation',
    'digital classroom'
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'SmartLearning Blog | Insights for Students, Parents, and Tutors',
    description:
      'Read expert advice on improving grades, building confidence, and making the most of online learning with SmartLearning by Caesarea College.',
    url: canonicalUrl,
    type: 'website',
    images: [
      {
        url: logoImage,
        width: 1200,
        height: 630,
        alt: 'SmartLearning by Caesarea College Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartLearning Blog | Insights for Students, Parents, and Tutors',
    description:
      'Guides for students, parents, and tutors to thrive with SmartLearning by Caesarea College.',
    images: [logoImage]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function BlogPage() {
  const articles = await fetchArticles();

  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SmartLearning by Caesarea College Blog',
    url: canonicalUrl,
    description:
      'Expert articles on online learning, tutoring strategies, study skills, and digital classroom success for students, parents, and educators.',
    publisher: {
      '@type': 'Organization',
      name: 'SmartLearning by Caesarea College',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}${logoImage}`
      }
    },
    blogPost: articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.publishedAt,
      url: `${canonicalUrl}/${article.slug}`,
      image: `${siteUrl}${article.heroImage ?? logoImage}`,
      keywords: article.tags.join(', ')
    }))
  };

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen">
      <section className="bg-gradient-to-br from-maroon to-black text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.2em] text-gold mb-4 text-sm font-semibold">
              SmartLearning by Caesarea College
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Blog: Evidence-Based Insights for Modern Learning
            </h1>
            <p className="text-lg text-gray-100 mb-8">
              Research-backed articles, templates, and checklists to help students, parents, and tutors thrive
              with online learning—curated by SmartLearning experts.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/15 text-white px-4 py-2 rounded-full border border-white/20 text-sm">
                Study Strategies
              </span>
              <span className="bg-white/15 text-white px-4 py-2 rounded-full border border-white/20 text-sm">
                Parent Guides
              </span>
              <span className="bg-white/15 text-white px-4 py-2 rounded-full border border-white/20 text-sm">
                Tutor Playbooks
              </span>
              <span className="bg-white/15 text-white px-4 py-2 rounded-full border border-white/20 text-sm">
                EdTech Tools
              </span>
            </div>
          </div>
          <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-maroon">Latest Highlights</h2>
            <ul className="space-y-4">
              {articles.map((post) => (
                <li key={post.slug} className="flex items-start gap-3">
                  <div className="mt-1 text-maroon">
                    <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{post.audience}</p>
                    <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.excerpt}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
              <i className="fa-solid fa-bolt text-yellow-500" aria-hidden="true" />
              <span>Actionable checklists and templates in every article.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-maroon font-semibold">Blog Library</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Guides Built for Real Results</h2>
            <p className="text-gray-600 mt-2">
              Bookmark deep-dives that cover study routines, accountability frameworks, and engagement tactics.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-maroon text-white px-5 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
          >
            Start Learning
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-semibold text-maroon">{post.audience}</span>
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-clock" aria-hidden="true" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold text-black">{post.title}</h3>
              <p className="text-gray-600 flex-1">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-maroon font-semibold hover:text-black"
              >
                Read the guide
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 px-6 border-t border-gray-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-maroon font-semibold">Built for SEO</p>
            <h2 className="text-3xl font-bold text-black">Fast, readable, and optimized content</h2>
            <p className="text-gray-600">
              We pair concise headlines with descriptive subtext, schema markup, and internal links so every post
              is discoverable and helpful for readers.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Schema.org Blog markup and descriptive meta tags on every page.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Readable layouts with scannable headings, bullets, and clear CTAs.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 mt-1">
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <span>Internal links back to courses, login, and registration for strong site structure.</span>
              </li>
            </ul>
            <div className="flex gap-3">
              <Link
                href="/featured-courses"
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-semibold hover:bg-maroon transition-colors"
              >
                Explore Courses
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-gray-300 text-black px-5 py-3 rounded-lg font-semibold hover:border-maroon hover:text-maroon transition-colors"
              >
                Sign In
                <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-maroon text-white flex items-center justify-center text-2xl font-bold">
                <i className="fa-solid fa-rocket" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-gray-500">SEO Checklist</p>
                <h3 className="text-xl font-semibold text-black">Every article ships optimized</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Keyword-rich titles', 'Optimized descriptions', 'Internal linking', 'Mobile-first layout', 'Fast load time', 'Structured data'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                    <span className="text-green-600">
                      <i className="fa-solid fa-circle-check" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-maroon text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.18em] text-gold font-semibold">Stay Updated</p>
          <h2 className="text-3xl font-bold">Get new articles, templates, and checklists first</h2>
          <p className="text-gray-100 max-w-3xl mx-auto">
            Subscribe for actionable strategies that boost retention, participation, and exam readiness.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Link
              href="/register"
              className="bg-gold text-maroon px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Create a free account
            </Link>
            <Link
              href="/login"
              className="border border-white/40 px-6 py-3 rounded-lg font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Existing user? Sign in
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
    </main>
  );
}
