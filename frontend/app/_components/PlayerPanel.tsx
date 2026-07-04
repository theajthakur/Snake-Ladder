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
    <div className="w-full bg-secondary-900 border border-secondary-700 rounded-xl overflow-hidden shadow-sm">

      {/* Player rows */}
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((player, idx) => {
            const isCurrent = player.id === currentPlayerId
            const config    = PLAYERS[player.id]
            return (
              <tr
                key={player.id}
                style={{
                  backgroundColor: isCurrent ? `${config.color}15` : 'transparent',
                }}
                className={`transition-colors duration-250 ${
                  idx < rows.length - 1 ? 'border-b border-secondary-800/40' : ''
                }`}
              >
                {/* Token */}
                <td className="p-1 lg:p-2 pl-2 lg:pl-3.5 w-9 lg:w-11 align-middle">
                  <div className="hidden lg:block">
                    <PlayerToken playerId={player.id} size={28} />
                  </div>
                  <div className="block lg:hidden">
                    <PlayerToken playerId={player.id} size={22} />
                  </div>
                </td>

                {/* Name */}
                <td className="p-1 lg:p-2 pr-2 lg:pr-3.5 pl-1 align-middle">
                  <span
                    style={{
                      color: isCurrent ? config.color : undefined,
                    }}
                    className={`text-[0.7rem] lg:text-xs tracking-wide font-sans transition-colors duration-250 ${
                      isCurrent ? 'font-extrabold' : 'font-semibold text-secondary-300'
                    }`}
                  >
                    {player.name}
                  </span>
                </td>

                {/* "▶" active indicator */}
                <td className="p-1 lg:p-2 pr-2 lg:pr-2.5 pl-0 align-middle w-5 text-right">
                  {isCurrent && (
                    <span style={{ color: config.color }} className="text-[0.6rem] lg:text-[0.7rem]">
                      ▶
                    </span>
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
