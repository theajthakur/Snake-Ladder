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
    <div
      style={{
        position:       'fixed',
        bottom:         16,
        right:          16,
        zIndex:         999,
        display:        'flex',
        gap:            10,
        alignItems:     'center',
        background:     'rgba(0,0,0,0.65)',
        border:         '1px solid rgba(255,255,255,0.15)',
        borderRadius:   12,
        padding:        '8px 14px',
        backdropFilter: 'blur(8px)',
      }}
    >
      {PLAYERS.map((p) => (
        <PlayerToken key={p.id} playerId={p.id} size={38} />
      ))}
    </div>
  )
}
