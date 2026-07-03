/**
 * TokenPreviewStrip.tsx
 *
 * Fixed bottom-right glassmorphic strip showing all player tokens.
 * Temporary dev preview — can be removed once tokens are placed on the board.
 */
import React from 'react'
import { PLAYERS } from '@/app/data/players'
import PlayerToken from '@/app/_components/PlayerToken'

export default function TokenPreviewStrip() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2.5 items-center bg-secondary-900 border border-secondary-700 rounded-xl p-2 px-3.5 shadow-sm">
      {PLAYERS.map((p) => (
        <PlayerToken key={p.id} playerId={p.id} size={38} />
      ))}
    </div>
  )
}
