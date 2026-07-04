'use client'

/**
 * PredictionPanel.tsx
 *
 * Compact top-right gaming panel showing upcoming traps (snakes) and climbers (ladders)
 * in range [2, 6] for the active player.
 */
import React from 'react'
import type { BoardPrediction } from '@/app/_components/BoardGrid'
import { PLAYERS } from '@/app/data/players'
import { Sparkles, Dice5, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface PredictionPanelProps {
  predictions: BoardPrediction[]
  activePlayerId: number
}

export default function PredictionPanel({
  predictions,
  activePlayerId,
}: PredictionPanelProps) {
  const activeColor = PLAYERS[activePlayerId].color

  return (
    <div className="w-full bg-secondary-900 border border-secondary-700 rounded-xl overflow-hidden shadow-lg select-none">

      {/* Predictions Body */}
      <div className="p-2 flex flex-col gap-1.5 max-h-44 overflow-y-auto box-border">
        {predictions.length === 0 ? (
          <div className="text-[0.6rem] text-secondary-500 text-center py-2.5 italic">
            Safe path ahead (2–6)
          </div>
        ) : (
          predictions.map((p) => {
            const isLadder = p.type === 'ladder'
            const diff = isLadder
              ? p.resolvedCell - p.targetCell
              : p.targetCell - p.resolvedCell

            return (
              <div
                key={p.diceValue}
                style={{
                  borderColor: isLadder ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  backgroundColor: isLadder ? 'rgba(16, 185, 129, 0.04)' : 'rgba(239, 68, 68, 0.04)'
                }}
                className="flex flex-col gap-0.5 border rounded-lg p-1.5 transition-all duration-200"
              >
                {/* Roll & Land Info */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[0.6rem] font-black tracking-wider flex items-center gap-1 ${
                      isLadder ? 'text-emerald-400' : 'text-primary-400'
                    }`}
                  >
                    <Dice5 size={10} className="opacity-70" />
                    <span>Roll {p.diceValue}</span>
                  </span>
                  <span className="text-[0.5rem] font-bold text-secondary-400 bg-secondary-850 px-1 rounded-sm">
                    Cell {p.targetCell}
                  </span>
                </div>

                {/* Outcome */}
                <div className="text-[0.58rem] text-secondary-300 flex items-center justify-between font-sans leading-none mt-0.5">
                  <span className="flex items-center gap-1">
                    {isLadder ? (
                      <ArrowUpRight size={10} className="text-emerald-500" strokeWidth={3} />
                    ) : (
                      <ArrowDownRight size={10} className="text-primary-500" strokeWidth={3} />
                    )}
                    <span className="text-[0.52rem] text-secondary-500 font-bold uppercase mr-0.5">
                      {isLadder ? 'Climb to' : 'Slide to'}
                    </span>
                    <strong className="text-secondary-100 font-extrabold text-[0.62rem]">
                      {p.resolvedCell}
                    </strong>
                  </span>
                  <span
                    className={`font-black ${
                      isLadder ? 'text-emerald-400' : 'text-primary-400'
                    }`}
                  >
                    {isLadder ? `+${diff}` : `-${diff}`}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
