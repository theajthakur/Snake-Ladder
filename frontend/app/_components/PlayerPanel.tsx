// ─────────────────────────────────────────────
//  PlayerPanel — fixed top-left player listing
// ─────────────────────────────────────────────
import React from 'react'
import { PLAYERS } from '@/app/data/players'
import PlayerToken from '@/app/_components/PlayerToken'
import type { GamePlayer } from '@/app/_store/gameStore'

interface PlayerPanelProps {
  /**
   * Active players to display.
   * Falls back to all 4 from PLAYERS if omitted (e.g. dev mode).
   */
  players?: GamePlayer[]
  /** Highlight the row of the current player */
  currentPlayerId?: number
}

export default function PlayerPanel({ players, currentPlayerId }: PlayerPanelProps) {
  const rows = players ?? PLAYERS.map((p) => ({ id: p.id, name: p.name }))

  return (
    <div
      style={{
        position:       'fixed',
        top:             16,
        left:            16,
        zIndex:          999,
        minWidth:        190,
        background:     'rgba(0, 0, 0, 0.72)',
        border:         '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius:    14,
        backdropFilter: 'blur(12px)',
        overflow:       'hidden',
        boxShadow:      '0 8px 32px rgba(0,0,0,0.55)',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding:       '8px 14px',
          borderBottom:  '1px solid rgba(255,255,255,0.10)',
          fontSize:      '0.6rem',
          fontWeight:     700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.40)',
        }}
      >
        Players
      </div>

      {/* Player rows */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map((player, idx) => {
            const isCurrent = player.id === currentPlayerId
            const config    = PLAYERS[player.id]
            return (
              <tr
                key={player.id}
                style={{
                  borderBottom:
                    idx < rows.length - 1
                      ? '1px solid rgba(255,255,255,0.07)'
                      : 'none',
                  background: isCurrent
                    ? `${config.color}18`
                    : 'transparent',
                  transition: 'background 0.3s',
                }}
              >
                {/* Token */}
                <td style={{ padding: '8px 8px 8px 14px', width: 44, verticalAlign: 'middle' }}>
                  <PlayerToken playerId={player.id} size={28} />
                </td>

                {/* Name */}
                <td style={{ padding: '8px 14px 8px 4px', verticalAlign: 'middle' }}>
                  <span
                    style={{
                      fontSize:      '0.82rem',
                      fontWeight:     isCurrent ? 800 : 600,
                      color:          isCurrent ? config.color : 'rgba(255,255,255,0.7)',
                      textShadow:     isCurrent ? `0 0 8px ${config.color}88` : 'none',
                      letterSpacing: '0.02em',
                      fontFamily:    'system-ui, sans-serif',
                      transition:    'color 0.3s',
                    }}
                  >
                    {player.name}
                  </span>
                </td>

                {/* "▶" active indicator */}
                <td style={{ padding: '8px 10px 8px 0', verticalAlign: 'middle', width: 20 }}>
                  {isCurrent && (
                    <span style={{ color: config.color, fontSize: '0.7rem' }}>▶</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
