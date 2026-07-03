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
  rect:      ContainRect
  highlight?: number | null
  /** playerId → current board cell (0 = not yet entered) */
  positions?: Record<number, number>
  /** Active players (to render tokens) */
  players?:  GamePlayer[]
  predictions?: BoardPrediction[]
}

function cellNumber(rowIdx: number, colIdx: number): number {
  const boardRow = ROWS - rowIdx
  const isLTR    = boardRow % 2 === 1
  const base     = (boardRow - 1) * COLS
  return isLTR ? base + colIdx + 1 : base + COLS - colIdx
}

export default function BoardGrid({
  rect,
  highlight  = null,
  positions  = {},
  players    = [],
  predictions = [],
}: BoardGridProps) {
  return (
    <div
      style={{
        position:            'absolute',
        left:                 rect.left,
        top:                  rect.top,
        width:                rect.width,
        height:               rect.height,
        display:             'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
        padding:             '20px',
        boxSizing:           'border-box',
      }}
    >
      {Array.from({ length: ROWS }, (_, rowIdx) =>
        Array.from({ length: COLS }, (_, colIdx) => {
          const num          = cellNumber(rowIdx, colIdx)
          const isOdd        = num % 2 === 1
          const isHighlighted = num === highlight

          // Find if there is a prediction for this cell
          const pred = predictions.find((p) => p.targetCell === num)

          // Players whose current position matches this cell (and are on the board)
          const here = players.filter(
            (p) => positions[p.id] === num && num > 0,
          )

          let bg = isHighlighted
            ? 'rgba(255, 230, 0, 0.70)'
            : isOdd
              ? 'rgba(255, 200, 100, 0.13)'
              : 'rgba(100, 180, 255, 0.13)'
          let borderStyle = isHighlighted
            ? '2px solid rgba(255, 230, 0, 0.95)'
            : '1px solid rgba(255, 255, 255, 0.22)'
          let shadow = isHighlighted
            ? '0 0 12px 4px rgba(255, 230, 0, 0.55)'
            : 'none'

          if (!isHighlighted && pred) {
            if (pred.type === 'ladder') {
              bg = 'rgba(46, 204, 64, 0.22)'
              borderStyle = '2px solid #2ECC40'
              shadow = 'inset 0 0 12px rgba(46, 204, 64, 0.5), 0 0 8px rgba(46, 204, 64, 0.3)'
            } else {
              bg = 'rgba(255, 59, 59, 0.22)'
              borderStyle = '2px solid #FF3B3B'
              shadow = 'inset 0 0 12px rgba(255, 59, 59, 0.5), 0 0 8px rgba(255, 59, 59, 0.3)'
            }
          }

          return (
            <div
              key={num}
              style={{
                position:        'relative',
                backgroundColor: bg,
                border:          borderStyle,
                boxShadow:       shadow,
                display:         'flex',
                flexDirection:   'column',
                alignItems:      'center',
                justifyContent:  here.length > 0 ? 'space-between' : (pred ? 'space-around' : 'center'),
                padding:         here.length > 0 ? '2px' : '4px 2px',
                userSelect:      'none',
                transition:      'background-color 0.2s, box-shadow 0.2s, border 0.2s',
                overflow:        'hidden',
              }}
            >
              {/* Cell number */}
              <span
                style={{
                  fontSize:   here.length > 0 ? '0.48rem' : '0.60rem',
                  fontWeight:  700,
                  color:      isHighlighted ? '#000' : (pred ? (pred.type === 'ladder' ? '#2ECC40' : '#FF3B3B') : 'rgba(255,255,255,0.50)'),
                  lineHeight:  1,
                  alignSelf:  (here.length > 0 || pred) ? 'flex-start' : 'center',
                  paddingLeft: (here.length > 0 || pred) ? 2 : 0,
                }}
              >
                {num}
              </span>

              {/* Prediction Indicator Badge */}
              {!isHighlighted && pred && here.length === 0 && (
                <div
                  style={{
                    fontSize: '0.48rem',
                    fontWeight: 800,
                    color: '#fff',
                    backgroundColor: pred.type === 'ladder' ? 'rgba(46, 204, 64, 0.85)' : 'rgba(255, 59, 59, 0.85)',
                    padding: '2px 4px',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    animation: 'pulseScale 1.5s infinite alternate',
                  }}
                >
                  {pred.type === 'ladder' ? '🪜' : '🐍'} Roll {pred.diceValue}
                </div>
              )}

              {/* Player tokens in this cell */}
              {here.length > 0 && (
                <div
                  style={{
                    display:         'flex',
                    flexWrap:        'wrap',
                    gap:              1,
                    alignItems:      'center',
                    justifyContent:  'center',
                    flex:             1,
                    alignSelf:       'center',
                  }}
                >
                  {here.map((p) => {
                    // Scale token to fit: 1 player = 20px, 2+ = 16px, 3+ = 14px
                    const sz = here.length === 1 ? 20 : here.length <= 2 ? 16 : 14
                    return (
                      <PlayerToken
                        key={p.id}
                        playerId={p.id}
                        size={sz}
                        style={{
                          filter: `drop-shadow(0 0 4px ${PLAYERS[p.id].color})`,
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        }),
      )}
      <style>{`
        @keyframes pulseScale {
          0% { transform: scale(0.95); opacity: 0.85; }
          100% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
