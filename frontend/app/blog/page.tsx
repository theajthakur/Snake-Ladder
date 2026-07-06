'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { allBlogPosts, BlogPost } from '@/app/blog/data/blogRegistry'
import { Search, Calendar, Clock, BookOpen, ArrowLeft, Home } from 'lucide-react'
import GamingButton from '@/app/_components/GamingButton'

const CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'strategy', label: 'Strategy & Guides' },
  { id: 'mechanics', label: 'Dice Probability' },
  { id: 'history', label: 'History & Origins' },
  { id: 'lists', label: 'Play Lists' },
  { id: 'development', label: 'Dev Log' },
  { id: 'trends', label: 'Web Gaming Trends' },
]

export default function BlogListingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return allBlogPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
        post.keywords.some((k) => k.toLowerCase().includes(searchLower))
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory])

  // Featured post is the newest one (first item in the registry list)
  const featuredPost = useMemo(() => {
    return allBlogPosts[0]
  }, [])

  // Grid posts are the ones that don't match the featured post
  const gridPosts = useMemo(() => {
    return filteredPosts.filter((p) => p.id !== featuredPost.id)
  }, [filteredPosts, featuredPost])

  return (
    <div className="min-h-screen bg-secondary-900 text-secondary-100 font-sans flex flex-col">

      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-50 bg-secondary-900/90 backdrop-blur-md border-b border-secondary-800 py-4 px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-secondary-200 hover:text-primary-500 font-sans font-black tracking-tight text-lg transition-colors no-underline"
        >
          <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain rounded" />
          <span>Snake &amp; Ladder Blog</span>
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

      {/* ── Categories Filter Tabs ── */}
      <section className="max-w-7xl w-full mx-auto px-4 md:px-8 pt-8">
        <div className="flex gap-2 overflow-x-auto pb-3 border-b border-secondary-800/60 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all border outline-none ${selectedCategory === cat.id
                  ? 'border-primary-500 bg-primary-950/20 text-primary-400'
                  : 'border-secondary-800 bg-secondary-850/50 text-secondary-400 hover:border-secondary-700 hover:text-secondary-200'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Main Blogs Listings Section ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-12">
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center border border-secondary-800 bg-secondary-850/20 rounded-2xl">
            <BookOpen className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="text-secondary-200 font-bold uppercase">No Articles Found</h3>
            <p className="text-xs text-secondary-500 mt-1">Try resetting your search query or choosing another category.</p>
          </div>
        ) : (
          <>
            {/* ── 1. Featured Article Showcase ── */}
            {selectedCategory === 'all' && searchQuery === '' && (
              <section className="bg-secondary-850 border border-secondary-800 rounded-2xl overflow-hidden shadow-sm hover:border-secondary-750 transition-all p-6 md:p-8 flex flex-col justify-between relative min-h-[220px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,120,97,0.04)_0,transparent_75%)] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex gap-3 items-center text-[0.62rem] font-bold text-secondary-500 uppercase mb-3">
                    <span className="text-primary-500 font-extrabold bg-primary-950/30 px-2 py-0.5 rounded border border-primary-900/30">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {featuredPost.publishDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {featuredPost.readingTime}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-sans text-secondary-100 tracking-tight leading-tight uppercase mb-3 hover:text-primary-500 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`} className="text-secondary-100 hover:text-primary-500 no-underline">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-secondary-400 leading-relaxed font-inter">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-secondary-800/40 pt-4 mt-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-secondary-200">{featuredPost.author.name}</span>
                  </div>
                  <GamingButton onClick={() => window.location.href = `/blog/${featuredPost.slug}`} theme="primary" size="sm">
                    Read Article
                  </GamingButton>
                </div>
              </section>
            )}

            {/* ── 2. Grid of Blog Cards ── */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === 'all' && searchQuery === '' ? gridPosts : filteredPosts).map((post) => (
                <article
                  key={post.id}
                  className="bg-secondary-850 border border-secondary-800 rounded-xl overflow-hidden shadow-sm hover:border-secondary-750 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="p-5">
                      <div className="flex gap-2.5 items-center text-[0.58rem] font-bold text-secondary-500 uppercase mb-2">
                        <span className="text-primary-500 font-extrabold bg-primary-950/20 px-1.5 py-0.5 rounded border border-primary-900/20">
                          {post.category}
                        </span>
                        <span>{post.publishDate}</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h3 className="text-sm font-black font-sans text-secondary-100 tracking-tight leading-tight uppercase group-hover:text-primary-500 transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`} className="text-secondary-100 hover:text-primary-500 no-underline">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-secondary-400 mt-2 line-clamp-3 leading-relaxed font-inter">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-3 border-t border-secondary-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full" />
                      <span className="text-[0.65rem] font-bold text-secondary-300">{post.author.name}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[0.65rem] font-bold text-primary-500 hover:text-primary-400 no-underline"
                    >
                      Read More &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </main>

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
