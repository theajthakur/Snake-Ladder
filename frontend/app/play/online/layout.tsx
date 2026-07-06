import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Online Multiplayer Lobby - Play Snake & Ladder with Friends',
  description: 'Create or join real-time multiplayer rooms for Snake & Ladder online. Invite friends using room codes and play online board games in your browser.',
  alternates: {
    canonical: '/play/online',
  },
}

export default function OnlineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
