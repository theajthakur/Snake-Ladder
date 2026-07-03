/**
 * BoardGrid.tsx
 *
 * 10×10 snake-and-ladder numbered grid overlay.
 * - Positioned to exactly match the rendered image rect
 * - Shows player tokens on their current cells
 * - Highlights a chosen cell (debug / selection)
 *
 * Numbering:
 *   bottom-left = 1, bottom row LTR, alternates RTL/LTR, top-left = 100
 */
import React from 'react'
import type { ContainRect } from '@/app/_utils/boardGeometry'
import { PLAYERS } from '@/app/data/players'
import PlayerToken from '@/app/_components/PlayerToken'
import type { GamePlayer } from '@/app/_store/gameStore'

const ROWS = 10
const COLS = 10

export interface BoardPrediction {
  diceValue: number
  targetCell: number
  resolvedCell: number
  type: 'snake' | 'ladder'
}

export interface BoardGridProps {
  rect: ContainRect
  highlight?: number | null
  /** playerId → current board cell (0 = not yet entered) */
  positions?: Record<number, number>
  /** Active players (to render tokens) */
  players?: GamePlayer[]
  predictions?: BoardPrediction[]
}

function cellNumber(rowIdx: number, colIdx: number): number {
  const boardRow = ROWS - rowIdx
  const isLTR = boardRow % 2 === 1
  const base = (boardRow - 1) * COLS
  return isLTR ? base + colIdx + 1 : base + COLS - colIdx
}

export default function BoardGrid({
  rect,
  highlight = null,
  positions = {},
  players = [],
  predictions = [],
}: BoardGridProps) {
  return (
    <div
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }}
      className="absolute grid grid-cols-10 grid-rows-10 p-5 box-border"
    >
      {Array.from({ length: ROWS }, (_, rowIdx) =>
        Array.from({ length: COLS }, (_, colIdx) => {
          const num = cellNumber(rowIdx, colIdx)
          const isOdd = num % 2 === 1
          const isHighlighted = num === highlight

          // Find if there is a prediction for this cell
          const pred = predictions.find((p) => p.targetCell === num)

          // Players whose current position matches this cell (and are on the board)
          const here = players.filter(
            (p) => positions[p.id] === num && num > 0,
          )

          let bgClass = "bg-transparent"
          let borderClass = "border border-secondary-700/30"
          let textClass = "text-secondary-500"

          if (isHighlighted) {
            bgClass = "bg-accent-500/40"
            borderClass = "border-2 border-accent-500"
            textClass = "text-secondary-100"
          } else if (pred) {
            if (pred.type === 'ladder') {
              bgClass = "bg-accent-500/10"
              borderClass = "border border-accent-500"
              textClass = "text-accent-400"
            } else {
              bgClass = "bg-primary-500/10"
              borderClass = "border border-primary-500"
              textClass = "text-primary-400"
            }
          } else {
            bgClass = isOdd ? "bg-secondary-800/10" : "bg-secondary-800/30"
          }

          const justifyClass = here.length > 0 ? "justify-between" : (pred ? "justify-around" : "justify-center")
          const padClass = here.length > 0 ? "p-0.5" : "py-1 px-0.5"

          return (
            <div
              key={num}
              className={`relative ${bgClass} ${borderClass} ${justifyClass} ${padClass} flex flex-col items-center select-none overflow-hidden transition-all duration-200`}
            >
              {/* Cell number */}
              <span
                className={`font-bold ${here.length > 0 ? 'text-[0.48rem]' : 'text-[0.60rem]'
                  } ${textClass} ${(here.length > 0 || pred) ? 'self-start pl-0.5' : 'self-center'
                  } leading-none`}
              >
                {num}
              </span>

              {/* Prediction Indicator Text (Minimalist, No Badge) */}
              {!isHighlighted && pred && here.length === 0 && (
                <div
                  className={`text-[0.48rem] font-bold uppercase tracking-wider ${pred.type === 'ladder' ? 'text-accent-400 animate-pulse' : 'text-primary-400 animate-pulse'
                    }`}
                >
                  {pred.type === 'ladder' ? '🪜' : '🐍'} Roll {pred.diceValue}
                </div>
              )}

              {/* Player tokens in this cell */}
              {here.length > 0 && (
                <div className="flex flex-wrap gap-0.5 items-center justify-center flex-1 self-center">
                  {here.map((p) => {
                    const sz = here.length === 1 ? 20 : here.length <= 2 ? 16 : 14
                    return (
                      <PlayerToken
                        key={p.id}
                        playerId={p.id}
                        size={sz}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        }),
      )}
    </div>
  )
}
