/**
 * CurrentTurnDisplay.tsx
 * Fixed bottom-centre pill showing whose turn it is.
 */
import React from 'react'
import PlayerToken from '@/app/_components/PlayerToken'
import { PLAYERS } from '@/app/data/players'
import type { GamePlayer } from '@/app/_store/gameStore'

interface CurrentTurnDisplayProps {
  player: GamePlayer
}

export default function CurrentTurnDisplay({ player }: CurrentTurnDisplayProps) {
  const config = PLAYERS[player.id]

  return (
    <div
      style={{
        position:       'fixed',
        bottom:          20,
        left:            16,
        zIndex:          999,
        display:        'flex',
        alignItems:     'center',
        gap:             12,
        background:     'rgba(0,0,0,0.78)',
        border:         `1px solid ${config.color}55`,
        boxShadow:      `0 0 24px ${config.color}44, 0 4px 20px rgba(0,0,0,0.6)`,
        borderRadius:    16,
        padding:        '10px 22px 10px 14px',
        backdropFilter: 'blur(14px)',
        whiteSpace:     'nowrap',
      }}
    >
      {/* Pulsing token */}
      <div
        style={{
          animation:    'pulse 1.6s ease-in-out infinite',
        }}
      >
        <PlayerToken playerId={player.id} size={40} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            fontSize:      '0.6rem',
            fontWeight:    700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.45)',
          }}
        >
          Current Turn
        </span>
        <span
          style={{
            fontSize:   '1rem',
            fontWeight: 800,
            color:      config.color,
            textShadow: `0 0 10px ${config.color}88`,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {player.name}
        </span>
      </div>

      {/* Keyframe injected once via a style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1);    }
          50%       { transform: scale(1.12); }
        }
      `}</style>
    </div>
  )
}
