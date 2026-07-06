import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://snake-ladder-rouge.vercel.app'
  
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
  ]

  const infoRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...infoRoutes]
}
