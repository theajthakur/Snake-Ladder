'use client'

/**
 * PredictionPanel.tsx
 *
 * Fixed right-side panel (positioned at bottom-right or under highlight input)
 * that shows the ladders or snakes in range [2, 6] for the active player.
 */
import React from 'react'
import type { BoardPrediction } from '@/app/_components/BoardGrid'
import { PLAYERS } from '@/app/data/players'

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
    <div className="fixed bottom-4 right-4 z-50 w-60 bg-secondary-900 border border-secondary-700 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="py-2.5 px-3.5 border-b border-secondary-800 text-[0.6rem] font-bold tracking-wider uppercase text-secondary-500 flex items-center gap-1.5 box-border">
        🔮 Turn Predictions (Range 2–6)
      </div>

      {/* Body List */}
      <div className="p-3 flex flex-col gap-2 max-h-40 overflow-y-auto box-border">
        {predictions.length === 0 ? (
          <div className="text-xs text-secondary-500 text-center py-3 italic">
            No immediate danger/success cells in range (2–6)
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
                className={`flex flex-col gap-1 border rounded-lg p-2.5 shadow-sm transition-transform duration-200 ${
                  isLadder
                    ? 'bg-accent-950/20 border-accent-800/30'
                    : 'bg-primary-950/20 border-primary-800/30'
                }`}
              >
                {/* Roll & Cell info */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-black font-sans ${
                      isLadder ? 'text-accent-400' : 'text-primary-400'
                    }`}
                  >
                    🎲 Roll {p.diceValue}
                  </span>
                  <span className="text-[0.62rem] font-bold text-secondary-400 bg-secondary-800 px-1 py-0.5 rounded">
                    Land: {p.targetCell}
                  </span>
                </div>

                {/* Outcome */}
                <div className="text-[0.7rem] text-secondary-200 flex items-center justify-between font-sans">
                  <span>
                    {isLadder ? '🪜 Climb to ' : '🐍 Slide to '}
                    <strong className="text-white text-xs font-extrabold">
                      {p.resolvedCell}
                    </strong>
                  </span>
                  <span
                    className={`font-black ${
                      isLadder ? 'text-accent-400' : 'text-primary-400'
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
