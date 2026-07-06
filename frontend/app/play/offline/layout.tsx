import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Local Offline Play - Snake & Ladder Board Game',
  description: 'Play Snake & Ladder offline with 1-4 players local. Roll the dice and enjoy local multiplayer board games on a single screen.',
  alternates: {
    canonical: '/play/offline',
  },
}

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
