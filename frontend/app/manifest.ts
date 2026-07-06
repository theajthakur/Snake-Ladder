import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Snake & Ladder Multiplayer Online',
    short_name: 'Snake & Ladder',
    description: 'An interactive Snake & Ladder board game. Play local offline matches or connect in multiplayer online rooms.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/logo.png',
        sizes: '100x100',
        type: 'image/png',
      },
      {
        src: '/MAIN_LOGO.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
