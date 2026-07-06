import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { infoPages } from '@/app/info/infoData'
import ContactForm from '@/app/info/ContactForm'
import BugForm from '@/app/info/BugForm'
import FeedbackForm from '@/app/info/FeedbackForm'
import { BookOpen, Scale, Terminal, HeartHandshake, ArrowLeft, Home } from 'lucide-react'

// Define static slugs to pre-render at build time
export async function generateStaticParams() {
  return Object.keys(infoPages).map((slug) => ({
    slug,
  }))
}

// Generate dynamic metadata for each path
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = infoPages[slug]
  if (!page) return {}

  return {
    title: `${page.title}`,
    description: page.description,
    alternates: {
      canonical: `/${slug}`,
    },
  }
}

const CATEGORIES = [
  {
    id: 'guides' as const,
    label: 'Guides & Manuals',
    icon: BookOpen,
  },
  {
    id: 'legal' as const,
    label: 'Legal & Policies',
    icon: Scale,
  },
  {
    id: 'technical' as const,
    label: 'Technical Info',
    icon: Terminal,
  },
  {
    id: 'support' as const,
    label: 'Support & Feedback',
    icon: HeartHandshake,
  },
]

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const activePage = infoPages[slug]

  if (!activePage) {
    notFound()
  }

  // Get other pages in the same category for contextual cross-linking
  const relatedPages = Object.values(infoPages).filter(
    (p) => p.category === activePage.category && p.slug !== activePage.slug
  )

  return (
    <div className="min-h-screen bg-secondary-900 text-secondary-100 font-sans flex flex-col">
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-50 bg-secondary-900/90 backdrop-blur-md border-b border-secondary-800 py-4 px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-secondary-200 hover:text-primary-500 font-sans font-black tracking-tight text-lg transition-colors no-underline"
        >
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain rounded" />
          <span>Snake &amp; Ladder</span>
        </Link>
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-800 hover:bg-secondary-750 border border-secondary-700 hover:border-secondary-600 text-xs font-bold rounded-lg transition-colors text-secondary-200 no-underline"
          >
            <Home size={14} />
            <span>Home</span>
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

      {/* ── Main Layout Wrapper ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">

        {/* ── Left Sidebar Navigation (Desktop) ── */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          {CATEGORIES.map((cat) => {
            const catPages = Object.values(infoPages).filter((p) => p.category === cat.id)
            const Icon = cat.icon

            return (
              <div key={cat.id} className="bg-secondary-850/40 border border-secondary-800/60 rounded-xl p-4">
                <h4 className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-wider text-secondary-400 mb-3 font-sans pb-1.5 border-b border-secondary-800/40">
                  <Icon size={13} className="text-primary-500" />
                  <span>{cat.label}</span>
                </h4>
                <ul className="space-y-1 p-0 m-0 list-none">
                  {catPages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/${page.slug}`}
                        className={`block px-3 py-2 rounded-lg text-xs font-bold transition-all no-underline ${page.slug === activePage.slug
                            ? 'bg-primary-950/20 border border-primary-800/40 text-primary-400 font-extrabold'
                            : 'text-secondary-400 hover:text-secondary-200 hover:bg-secondary-800/30'
                          }`}
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </aside>

        {/* ── Right Content Container ── */}
        <main className="flex-1 min-w-0">
          <article className="bg-secondary-850 border border-secondary-800 rounded-2xl p-6 md:p-10 shadow-sm font-inter text-secondary-300">
            {/* Header */}
            <header className="mb-8 pb-6 border-b border-secondary-800/60">
              <span className="text-[0.62rem] font-bold text-primary-500 uppercase tracking-wider bg-primary-950/30 px-2.5 py-1 rounded border border-primary-900/30">
                {CATEGORIES.find((c) => c.id === activePage.category)?.label}
              </span>
              <h1 className="text-3xl font-black font-sans text-secondary-100 tracking-tight mt-3 mb-2 uppercase">
                {activePage.title}
              </h1>
              <p className="text-sm text-secondary-400 font-medium leading-relaxed">
                {activePage.description}
              </p>
            </header>

            {/* Sections */}
            <div className="space-y-8">
              {activePage.sections.map((sect, idx) => (
                <section key={idx} className="space-y-4">
                  {sect.heading && (
                    <h2 className="text-lg font-bold font-sans text-secondary-100 uppercase tracking-wide">
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
                </section>
              ))}

              {/* Dynamic Interactive Form Integrations */}
              {activePage.slug === 'contact' && (
                <section className="mt-8 pt-8 border-t border-secondary-800/40">
                  <h2 className="text-lg font-bold font-sans text-secondary-100 uppercase tracking-wide mb-4">
                    Send General Message
                  </h2>
                  <ContactForm />
                </section>
              )}

              {activePage.slug === 'report-bug' && (
                <section className="mt-8 pt-8 border-t border-secondary-800/40">
                  <h2 className="text-lg font-bold font-sans text-secondary-100 uppercase tracking-wide mb-4">
                    File a Telemetry Bug Report
                  </h2>
                  <BugForm />
                </section>
              )}

              {activePage.slug === 'feedback' && (
                <section className="mt-8 pt-8 border-t border-secondary-800/40">
                  <h2 className="text-lg font-bold font-sans text-secondary-100 uppercase tracking-wide mb-4">
                    Share Platform Experience Rating
                  </h2>
                  <FeedbackForm />
                </section>
              )}
            </div>
          </article>

          {/* ── Contextual Internal Links footer (EEAT verification flow) ── */}
          {relatedPages.length > 0 && (
            <div className="mt-8 p-6 bg-secondary-850/30 border border-secondary-800/60 rounded-xl">
              <h4 className="text-xs font-bold text-secondary-200 uppercase tracking-wide mb-3 font-sans">
                Related Resources in this section:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedPages.slice(0, 3).map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className="p-3 bg-secondary-900/50 hover:bg-secondary-800/40 border border-secondary-800 rounded-lg text-xs font-bold text-primary-400 hover:text-primary-350 no-underline transition-all"
                  >
                    {page.title} &rarr;
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer copyright */}
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
