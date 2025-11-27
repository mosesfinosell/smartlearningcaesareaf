import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchArticle, fetchArticles } from '../articles';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const logoImage = '/images/smartlearninglogo.jpeg';

type Params = { slug: string };

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const article = await fetchArticle(params.slug);
  const url = `${siteUrl}/blog/${params.slug}`;

  if (!article) {
    return {
      metadataBase: new URL(siteUrl),
      title: 'SmartLearning Blog',
      description: 'Online learning insights from SmartLearning by Caesarea College.',
      alternates: { canonical: url }
    };
  }

  const image = article.heroImage ?? logoImage;

  return {
    metadataBase: new URL(siteUrl),
    title: `${article.title} | SmartLearning Blog`,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: `${article.title} | SmartLearning Blog`,
      description: article.excerpt,
      url,
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | SmartLearning Blog`,
      description: article.excerpt,
      images: [image]
    }
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const article = await fetchArticle(params.slug);

  if (!article) return notFound();

  const publishedDate = new Date(article.publishedAt);
  const publishedLabel = Number.isNaN(publishedDate.getTime())
    ? article.publishedAt
    : publishedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'SmartLearning by Caesarea College',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmartLearning by Caesarea College',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}${logoImage}`
      }
    },
    image: `${siteUrl}${article.heroImage ?? logoImage}`,
    keywords: article.tags.join(', '),
    url: `${siteUrl}/blog/${article.slug}`
  };

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-gradient-to-br from-maroon to-black text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-200 hover:text-gold text-sm mb-6">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            Back to blog
          </Link>
          <p className="text-sm uppercase tracking-[0.18em] text-gold font-semibold">{article.audience}</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-3 mb-4">{article.title}</h1>
          <p className="text-lg text-gray-100 max-w-3xl">{article.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-200">
            <span className="inline-flex items-center gap-2">
              <i className="fa-regular fa-calendar" aria-hidden="true" />
              {publishedLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="fa-regular fa-clock" aria-hidden="true" />
              {article.readTime}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/15 border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14">
        <article className="space-y-10 text-lg leading-8">
          {article.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-2xl font-semibold text-black">{section.heading}</h2>
              {section.body.map((paragraph, idx) => (
                <p key={idx} className="text-gray-800">
                  {paragraph}
                </p>
              ))}
              {section.highlight && (
                <div className="border-l-4 border-maroon bg-gray-50 p-4 text-gray-800">
                  <p className="italic">“{section.highlight}”</p>
                </div>
              )}
              {section.bullets && (
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <div className="mt-12 p-8 rounded-2xl border border-gray-200 bg-gray-50 space-y-4">
          <h3 className="text-xl font-semibold text-black">Put this into action</h3>
          <p className="text-gray-700">
            Save this guide, share it with your study group, and try one experiment this week. If you want
            personalized support, explore our featured courses or log in to continue where you left off.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/featured-courses"
              className="inline-flex items-center gap-2 bg-maroon text-white px-5 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              Explore courses
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-gray-300 text-black px-5 py-3 rounded-lg font-semibold hover:border-maroon hover:text-maroon transition-colors"
            >
              Sign in
              <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
    </main>
  );
}
