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
      style={{ borderColor: `${config.color}55` }}
      className="fixed bottom-5 left-4 z-50 flex items-center gap-3 bg-secondary-900 border rounded-2xl p-2.5 pr-5.5 pl-3.5 whitespace-nowrap shadow-md"
    >
      {/* Pulsing token */}
      <div className="animate-[pulse_1.6s_ease-in-out_infinite]">
        <PlayerToken playerId={player.id} size={40} />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[0.6rem] font-bold tracking-widest uppercase text-secondary-500">
          Current Turn
        </span>
        <span
          style={{ color: config.color }}
          className="text-base font-extrabold font-sans"
        >
          {player.name}
        </span>
      </div>

      {/* Keyframe injected once via a style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1);    }
          50%       { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
