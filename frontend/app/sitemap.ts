import type { MetadataRoute } from 'next'
import { allBlogPosts } from '@/app/blog/data/blogRegistry'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.snakeladder.me'
  
  const slugs = [
    'about', 'contact', 'privacy', 'terms', 'cookie-policy', 'disclaimer', 'faq',
    'how-to-play', 'rules', 'features', 'multiplayer-guide', 'fair-play',
    'browser-compatibility', 'supported-devices', 'accessibility', 'community-guidelines',
    'responsible-gaming', 'safety-privacy', 'changelog', 'roadmap', 'help',
    'report-bug', 'feedback', 'credits', 'licenses'
  ]

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/play/online`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/play/offline`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const infoRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogRoutes: MetadataRoute.Sitemap = allBlogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...infoRoutes, ...blogRoutes]
}
