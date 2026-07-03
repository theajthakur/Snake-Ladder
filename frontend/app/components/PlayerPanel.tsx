// ─────────────────────────────────────────────
//  PlayerPanel — fixed top-left player listing
// ─────────────────────────────────────────────
import React from 'react'
import { PLAYERS } from '@/app/data/players'
import PlayerToken from '@/app/components/PlayerToken'

export default function PlayerPanel() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 999,
        minWidth: 180,
        background: 'rgba(0, 0, 0, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 14,
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '8px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
        }}
      >
        Players
      </div>

      {/* Player rows */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <tbody>
          {PLAYERS.map((player, idx) => (
            <tr
              key={player.id}
              style={{
                borderBottom:
                  idx < PLAYERS.length - 1
                    ? '1px solid rgba(255,255,255,0.07)'
                    : 'none',
              }}
            >
              {/* Token column */}
              <td
                style={{
                  padding: '8px 10px 8px 14px',
                  width: 46,
                  verticalAlign: 'middle',
                }}
              >
                <PlayerToken playerId={player.id} size={30} />
              </td>

              {/* Player name column */}
              <td
                style={{
                  padding: '8px 14px 8px 4px',
                  verticalAlign: 'middle',
                }}
              >
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: player.color,
                    textShadow: `0 0 8px ${player.color}88`,
                    letterSpacing: '0.02em',
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {player.name}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
