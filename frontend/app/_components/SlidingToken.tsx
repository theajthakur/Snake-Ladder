'use client'

/**
 * SlidingToken.tsx
 *
 * An absolutely-positioned player token that CSS-transitions
 * in a straight line from one board cell to another.
 *
 * Used for snake slides and ladder climbs.
 */
import React, { useEffect, useRef, useState } from 'react'
import PlayerToken from '@/app/_components/PlayerToken'
import type { ContainRect } from '@/app/_utils/boardGeometry'

const GRID_PADDING = 20   // must match BoardGrid's padding value

/** Returns the pixel centre of a board cell within the viewport. */
function cellCenter(cell: number, rect: ContainRect): { x: number; y: number } {
  const COLS    = 10
  const ROWS    = 10
  const cellW   = (rect.width  - 2 * GRID_PADDING) / COLS
  const cellH   = (rect.height - 2 * GRID_PADDING) / ROWS

  const boardRow = Math.ceil(cell / COLS)                    // 1 (bottom) → 10 (top)
  const posInRow = (cell - 1) % COLS                         // 0-9
  const isLTR    = boardRow % 2 === 1
  const colIdx   = isLTR ? posInRow : (COLS - 1 - posInRow) // CSS column index
  const rowIdx   = ROWS - boardRow                           // CSS row index (0 = top)

  return {
    x: rect.left + GRID_PADDING + (colIdx + 0.5) * cellW,
    y: rect.top  + GRID_PADDING + (rowIdx  + 0.5) * cellH,
  }
}

export interface SlidingTokenProps {
  playerId:  0 | 1 | 2 | 3
  fromCell:  number
  toCell:    number
  rect:      ContainRect
  /** Slide duration in ms */
  duration?: number
  tokenSize?: number
  onDone:    () => void
}

export default function SlidingToken({
  playerId,
  fromCell,
  toCell,
  rect,
  duration  = 650,
  tokenSize = 26,
  onDone,
}: SlidingTokenProps) {
  const from = cellCenter(fromCell, rect)
  const to   = cellCenter(toCell,   rect)

  // Start at `from`, transition to `to` after mount
  const [pos,      setPos]      = useState(from)
  const [active,   setActive]   = useState(false)  // transition enabled?
  const calledDone              = useRef(false)

  useEffect(() => {
    // Two rAF: first lets browser paint the initial (from) position,
    // second triggers the CSS transition to (to).
    const id1 = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setActive(true)
        setPos(to)
      })
    )
    return () => cancelAnimationFrame(id1)
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Safety fallback: call onDone if transitionend never fires
  useEffect(() => {
    const id = setTimeout(() => {
      if (!calledDone.current) { calledDone.current = true; onDone() }
    }, duration + 300)
    return () => clearTimeout(id)
  }, [duration, onDone])

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // transitionend fires for each property; only respond to 'left'
    if (e.propertyName === 'left' && !calledDone.current) {
      calledDone.current = true
      onDone()
    }
  }

  const half = tokenSize / 2

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      style={{
        left:           pos.x - half,
        top:            pos.y - half,
        width:          tokenSize,
        height:         tokenSize,
        transition:     active
          ? `left ${duration}ms cubic-bezier(0.4,0,0.2,1), top ${duration}ms cubic-bezier(0.4,0,0.2,1)`
          : 'none',
      }}
      className="absolute z-[200] pointer-events-none"
    >
      <PlayerToken playerId={playerId} size={tokenSize} />
    </div>
  )
}
