import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  allBlogPosts,
  getBlogBySlug,
  getRelatedBlogs,
  getRecentBlogs
} from '@/app/blog/data/blogRegistry'
import FaqAccordion from './FaqAccordion'
import {
  ArrowLeft,
  Home,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
  Dice5,
  CalendarDays,
  UserCheck
} from 'lucide-react'
import GamingButton from '@/app/_components/GamingButton'

// Static params to pre-render the 30 blog posts during build time
export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Dynamic SEO metadata mapping
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogBySlug(slug)
  if (!post) return {}

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://snake-ladder-rouge.vercel.app'

  return {
    title: `${post.title} | Snake & Ladder Blog`,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: `${baseUrl}/blog/${post.slug}`,
      title: post.title,
      description: post.metaDescription,
      siteName: 'Snake & Ladder Online',
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate,
      images: [
        {
          url: `${baseUrl}${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: [`${baseUrl}${post.coverImage}`],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogBySlug(slug)

  if (!post) {
    notFound()
  }

  const related = getRelatedBlogs(post.slug, 3)
  const recent = getRecentBlogs(4).filter((p) => p.slug !== post.slug)

  // Find index for pagination
  const curIndex = allBlogPosts.findIndex((p) => p.slug === post.slug)
  const prevPost = curIndex > 0 ? allBlogPosts[curIndex - 1] : null
  const nextPost = curIndex < allBlogPosts.length - 1 ? allBlogPosts[curIndex + 1] : null

  // Generate Table of Contents from headings
  const toc = post.sections
    .filter((s) => s.heading)
    .map((s) => ({
      title: s.heading!,
      id: s.heading!.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }))

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://snake-ladder-rouge.vercel.app'

  // ── JSON-LD Structured Data ──
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.metaDescription,
    'image': `${baseUrl}${post.coverImage}`,
    'datePublished': post.publishDate,
    'dateModified': post.updatedDate,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'jobTitle': post.author.role,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Snake & Ladder Online',
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo.png`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `${baseUrl}/blog/${post.slug}`,
      },
    ],
  }

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': post.faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  } : null

  return (
    <div className="min-h-screen bg-secondary-900 text-secondary-100 font-sans flex flex-col">
      {/* Script injections for Google structured parsing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-50 bg-secondary-900/90 backdrop-blur-md border-b border-secondary-800 py-4 px-6 flex items-center justify-between">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-secondary-200 hover:text-primary-500 font-sans font-black tracking-tight text-lg transition-colors no-underline"
        >
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain rounded" />
          <span>Snake &amp; Ladder Blog</span>
        </Link>
        <div className="flex gap-3">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-800 hover:bg-secondary-750 border border-secondary-700 hover:border-secondary-600 text-xs font-bold rounded-lg transition-colors text-secondary-200 no-underline"
          >
            <BookOpen size={14} />
            <span>Articles</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-xs font-black rounded-lg transition-colors text-white no-underline shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Play Game</span>
          </Link>
        </div>
      </header>

      {/* ── Breadcrumb Bar ── */}
      <div className="bg-secondary-950 border-b border-secondary-800/60 py-3 px-4">
        <nav className="max-w-7xl w-full mx-auto flex items-center gap-1.5 text-[0.68rem] font-bold text-secondary-500 font-sans uppercase">
          <Link href="/" className="hover:text-primary-500 no-underline text-secondary-500">Home</Link>
          <ChevronRight size={10} className="text-secondary-700" />
          <Link href="/blog" className="hover:text-primary-500 no-underline text-secondary-500">Blog</Link>
          <ChevronRight size={10} className="text-secondary-700" />
          <span className="text-secondary-400 select-none max-w-xs truncate">{post.title}</span>
        </nav>
      </div>

      {/* ── Main Layout Wrapper ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* ── Left Content Body (Article) ── */}
        <main className="flex-1 min-w-0">
          <article className="bg-secondary-850 border border-secondary-800 rounded-2xl p-6 md:p-10 shadow-sm font-inter text-secondary-300">
            {/* Meta Header */}
            <header className="mb-8 pb-6 border-b border-secondary-800/60">
              <span className="text-[0.62rem] font-bold text-primary-500 uppercase tracking-wider bg-primary-950/30 px-2.5 py-1 rounded border border-primary-900/30 font-sans">
                {post.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-sans text-secondary-100 tracking-tight mt-4 mb-4 uppercase leading-tight">
                {post.title}
              </h1>
              <div className="flex gap-4 flex-wrap items-center text-xs text-secondary-400 font-sans font-medium">
                <span className="flex items-center gap-1">
                  <CalendarDays size={13} className="text-primary-500" />
                  Published: {post.publishDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-primary-500" />
                  Reading Time: {post.readingTime}
                </span>
              </div>
            </header>

            {/* Structured Post Content Sections */}
            <div className="space-y-8">
              {post.sections.map((sect, idx) => (
                <section key={idx} className="space-y-4">
                  {sect.heading && (
                    <h2
                      id={sect.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      className="text-lg font-bold font-sans text-secondary-100 uppercase tracking-wide scroll-mt-20 border-l-2 border-primary-500 pl-3"
                    >
                      {sect.heading}
                    </h2>
                  )}
                  {sect.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm leading-relaxed text-secondary-400">
                      {p}
                    </p>
                  ))}
                  
                  {sect.listItems && sect.listItems.length > 0 && (
                    sect.listType === 'ordered' ? (
                      <ol className="list-decimal list-inside space-y-2 text-sm text-secondary-400 pl-2">
                        {sect.listItems.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">{item}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc list-inside space-y-2 text-sm text-secondary-400 pl-2">
                        {sect.listItems.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    )
                  )}

                  {sect.codeBlock && (
                    <pre className="bg-secondary-900 border border-secondary-800 rounded-xl p-4 overflow-x-auto text-[0.7rem] font-mono text-primary-400 mt-3 select-all">
                      <code>{sect.codeBlock.code}</code>
                    </pre>
                  )}
                </section>
              ))}
            </div>

            {/* Author Biography Segment */}
            <section className="mt-12 pt-8 border-t border-secondary-800/60 bg-secondary-900/30 p-6 rounded-xl border border-secondary-800">
              <h4 className="text-[0.62rem] font-black uppercase tracking-wider text-secondary-500 mb-3 font-sans flex items-center gap-1.5">
                <UserCheck size={12} className="text-primary-500" />
                <span>About The Author</span>
              </h4>
              <div className="flex items-start gap-4">
                <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border border-secondary-750" />
                <div>
                  <h5 className="text-sm font-bold text-secondary-200 font-sans">{post.author.name}</h5>
                  <p className="text-[0.68rem] text-secondary-400 mt-0.5 mb-1.5">{post.author.role}</p>
                  <p className="text-xs text-secondary-400 leading-relaxed">
                    A dedicated board game professional, sharing technical mechanics and probability distributions behind online web-gaming platforms.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Accordions Section */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="mt-12 pt-8 border-t border-secondary-800/60">
                <h3 className="text-lg font-bold font-sans text-secondary-100 uppercase tracking-wide mb-6">
                  Frequently Asked Questions (FAQ)
                </h3>
                <FaqAccordion faqs={post.faqs} />
              </section>
            )}
          </article>

          {/* ── Pagination (Prev / Next links) ── */}
          <nav className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="flex-1 p-5 bg-secondary-850 hover:bg-secondary-800 border border-secondary-800 hover:border-secondary-700 rounded-xl text-left no-underline transition-all group"
              >
                <span className="text-[0.62rem] font-bold text-secondary-500 uppercase font-sans tracking-wide block mb-1">
                  &larr; Previous Post
                </span>
                <span className="text-xs font-bold text-secondary-200 group-hover:text-primary-500 transition-colors line-clamp-1">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="flex-1 p-5 bg-secondary-850 hover:bg-secondary-800 border border-secondary-800 hover:border-secondary-700 rounded-xl text-right no-underline transition-all group"
              >
                <span className="text-[0.62rem] font-bold text-secondary-500 uppercase font-sans tracking-wide block mb-1">
                  Next Post &rarr;
                </span>
                <span className="text-xs font-bold text-secondary-200 group-hover:text-primary-500 transition-colors line-clamp-1">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        </main>

        {/* ── Right Sticky Sidebar ── */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          
          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="bg-secondary-850 border border-secondary-800 rounded-xl p-5 max-h-[350px] overflow-y-auto hidden lg:block">
              <h4 className="text-[0.65rem] font-black uppercase tracking-wider text-secondary-400 mb-3 font-sans pb-1.5 border-b border-secondary-800/40">
                Table of Contents
              </h4>
              <ul className="space-y-2 p-0 m-0 list-none text-xs font-bold font-sans">
                {toc.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className="text-secondary-400 hover:text-primary-500 transition-colors no-underline block hover:translate-x-0.5 transition-transform"
                    >
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Featured Roll CTA */}
          <div className="bg-secondary-850 border border-secondary-800 rounded-xl p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,120,97,0.06)_0,transparent_100%)]" />
            <Dice5 size={32} className="text-primary-500 mx-auto mb-3 animate-bounce" />
            <h4 className="text-sm font-black font-sans uppercase text-secondary-100 tracking-wide mb-2">
              Ready to Climb the Board?
            </h4>
            <p className="text-xs text-secondary-400 leading-relaxed mb-4">
              Roll the dice online in real-time server lobbies with friends or play offline.
            </p>
            <Link
              href="/"
              className="inline-block w-full py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors no-underline shadow-sm"
            >
              Start Game Session
            </Link>
          </div>

          {/* Related Articles list */}
          {related.length > 0 && (
            <div className="bg-secondary-850 border border-secondary-800 rounded-xl p-5">
              <h4 className="text-[0.65rem] font-black uppercase tracking-wider text-secondary-400 mb-3 font-sans pb-1.5 border-b border-secondary-800/40">
                Related Articles
              </h4>
              <ul className="space-y-3.5 p-0 m-0 list-none">
                {related.map((rel) => (
                  <li key={rel.slug} className="group">
                    <Link
                      href={`/blog/${rel.slug}`}
                      className="block text-xs font-bold text-secondary-200 group-hover:text-primary-500 transition-colors no-underline line-clamp-2 leading-tight uppercase font-sans"
                    >
                      {rel.title}
                    </Link>
                    <span className="text-[0.55rem] text-secondary-500 font-bold block mt-1">{rel.publishDate}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent Articles list */}
          {recent.length > 0 && (
            <div className="bg-secondary-850 border border-secondary-800 rounded-xl p-5">
              <h4 className="text-[0.65rem] font-black uppercase tracking-wider text-secondary-400 mb-3 font-sans pb-1.5 border-b border-secondary-800/40">
                Recent Posts
              </h4>
              <ul className="space-y-3.5 p-0 m-0 list-none">
                {recent.map((rec) => (
                  <li key={rec.slug} className="group">
                    <Link
                      href={`/blog/${rec.slug}`}
                      className="block text-xs font-bold text-secondary-200 group-hover:text-primary-500 transition-colors no-underline line-clamp-2 leading-tight uppercase font-sans"
                    >
                      {rec.title}
                    </Link>
                    <span className="text-[0.55rem] text-secondary-500 font-bold block mt-1">{rec.publishDate}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

      </div>

      {/* ── Footer ── */}
      <footer className="bg-secondary-950 border-t border-secondary-800 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-secondary-500 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Snake &amp; Ladder Online. All rights reserved.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-secondary-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-secondary-400">Terms &amp; Conditions</Link>
            <Link href="/contact" className="hover:text-secondary-400">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
