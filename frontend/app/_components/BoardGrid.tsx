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
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
      className="absolute grid grid-cols-10 grid-rows-10 p-2.5 lg:p-5 box-border"
    >
      {Array.from({ length: ROWS }, (_, rowIdx) =>
        Array.from({ length: COLS }, (_, colIdx) => {
          const num = cellNumber(rowIdx, colIdx)
          const isOdd = num % 2 === 1

          // Find if there is a prediction for this cell
          const pred = predictions.find((p) => p.targetCell === num)

          // Players whose current position matches this cell (and are on the board)
          const here = players.filter(
            (p) => positions[p.id] === num && num > 0,
          )

          let bgClass = "bg-transparent"
          let borderClass = "border border-secondary-700/30"
          let textClass = "text-secondary-500"

          if (pred) {
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

          return (
            <div
              key={num}
              className={`relative ${bgClass} ${borderClass} flex flex-col items-center justify-center p-0.5 select-none overflow-hidden transition-all duration-200`}
            >

              {/* Prediction Indicator Text (Minimalist, No Badge) */}
              {pred && here.length === 0 && (
                <div
                  className={`text-[0.48rem] font-bold uppercase tracking-wider flex items-center gap-0.5 justify-center ${pred.type === 'ladder' ? 'text-accent-400 animate-pulse' : 'text-primary-400 animate-pulse'
                    }`}
                >
                  {pred.type === 'ladder' ? (
                    <ArrowUpRight size={8} strokeWidth={3} className="text-accent-400" />
                  ) : (
                    <ArrowDownRight size={8} strokeWidth={3} className="text-primary-400" />
                  )}
                  <span>Roll {pred.diceValue}</span>
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
