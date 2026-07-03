'use client'

/**
 * DiceRoller.tsx
 *
 * Fixed right-side dice panel.
 *
 * Animation strategy (RACE-CONDITION FREE):
 *  - When rolling=true  → CSS-only overlay cycles through all 6 faces (pure keyframes,
 *                         zero React state mutations, zero setInterval)
 *  - When rolling=false → overlay unmounts; underlying SVG shows EXACT `value` from props
 *
 * The actual die face is always driven by the `value` prop.
 * No internal display-state that can race with React's scheduler.
 */
import React, { useEffect } from 'react'
import { PLAYERS } from '@/app/data/players'
import PlayerToken from '@/app/_components/PlayerToken'
import type { GamePlayer } from '@/app/_store/gameStore'

// ── Dot positions per face (0-1 fractions of 100×100 viewBox) ───────────────
const DOTS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.72, 0.28], [0.28, 0.72]],
  3: [[0.72, 0.28], [0.5,  0.5 ], [0.28, 0.72]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5,  0.5 ], [0.28, 0.72], [0.72, 0.72]],
  6: [
    [0.28, 0.22], [0.28, 0.5], [0.28, 0.78],
    [0.72, 0.22], [0.72, 0.5], [0.72, 0.78],
  ],
}

const FACE_COUNT  = 6
const CYCLE_MS    = 360          // one full 1→2→3→4→5→6 cycle in ms
const STEP_FRAC   = 100 / FACE_COUNT  // each face is visible for 16.67% of cycle

// ── A single face in SVG ─────────────────────────────────────────────────────
function Face({
  face,
  color,
  size,
  style,
}: {
  face: number
  color: string
  size: number
  style?: React.CSSProperties
}) {
  const dots = DOTS[face] ?? DOTS[1]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: 'block', borderRadius: '18%', ...style }}
    >
      <rect x="2" y="2" width="96" height="96" rx="18" ry="18"
        fill="var(--color-secondary-900)"
        stroke={color}
        strokeWidth="3.5"
      />
      {dots.map(([fx, fy], i) => (
        <circle key={i} cx={fx * 100} cy={fy * 100} r={7} fill={color} />
      ))}
    </svg>
  )
}

// ── CSS-only rolling overlay: 6 faces staggered with animation-delay ─────────
function RollingOverlay({ color, size }: { color: string; size: number }) {
  const cycleSec = CYCLE_MS / 1000

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* keyframes: each face visible for 1/6 of cycle then hidden */}
      <style>{`
        @keyframes _df_show {
          0%                       { opacity: 1; }
          ${STEP_FRAC.toFixed(4)}% { opacity: 0; }
          100%                     { opacity: 0; }
        }
      `}</style>

      {[1, 2, 3, 4, 5, 6].map((face) => (
        <Face
          key={face}
          face={face}
          color={color}
          size={size}
          style={{
            position: face === 1 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            animation: `_df_show ${cycleSec}s steps(1, end) infinite`,
            animationDelay: `${(((face - 1) / FACE_COUNT) * CYCLE_MS) / 1000}s`,
          }}
        />
      ))}
    </div>
  )
}

// ── DiceRoller panel ─────────────────────────────────────────────────────────
export interface DiceRollerProps {
  currentPlayer: GamePlayer
  /** Exact dice value from the API — shown immediately when rolling=false */
  value: number
  /** True while API call is in flight — shows CSS rolling animation */
  rolling: boolean
  onRoll: () => void
  disabled?: boolean
}

export default function DiceRoller({
  currentPlayer,
  value,
  rolling,
  onRoll,
  disabled = false,
}: DiceRollerProps) {
  const config     = PLAYERS[currentPlayer.id]
  const isDisabled = rolling || disabled

  // Space-bar listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        if (!rolling && !disabled) onRoll()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onRoll, rolling, disabled])

  return (
    <div
      style={{ borderColor: `${config.color}44` }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-40 flex flex-col items-center bg-secondary-900 border border-secondary-700 rounded-2xl overflow-hidden shadow-md"
    >
      {/* ── Header ── */}
      <div className="w-full py-2.5 px-3.5 border-b border-secondary-800 text-[0.6rem] font-bold tracking-wider uppercase text-secondary-500 flex items-center gap-1.5 box-border">
        🎲 Dice
      </div>

      {/* ── Current player ── */}
      <div className="w-full py-2.5 px-3 border-b border-secondary-800 flex items-center gap-2 box-border">
        <PlayerToken playerId={currentPlayer.id} size={26} />
        <span
          style={{ color: config.color }}
          className="text-xs font-bold truncate flex-1 font-sans"
        >
          {currentPlayer.name}
        </span>
      </div>

      {/* ── Dice area ──
            rolling=true  → CSS animated overlay (all 6 faces, pure keyframes)
            rolling=false → exact API value face (no state, direct from prop)
      ── */}
      <div className="py-5">
        {rolling ? (
          <RollingOverlay color={config.color} size={100} />
        ) : (
          <Face face={Math.min(6, Math.max(1, value || 1))} color={config.color} size={100} />
        )}
      </div>

      {/* ── Last rolled label ── */}
      {!rolling && value >= 1 && (
        <div className="text-[0.6rem] font-bold tracking-wider text-secondary-400 -mt-3 mb-1">
          Rolled: <span style={{ color: config.color }}>{value}</span>
        </div>
      )}

      {/* ── Roll button ── */}
      <div className="w-full px-3.5 pb-3.5 box-border">
        <button
          id="roll-dice-btn"
          onClick={() => { if (!isDisabled) onRoll() }}
          disabled={isDisabled}
          style={{ backgroundColor: isDisabled ? undefined : config.color }}
          className={`w-full py-2.5 rounded-lg text-xs font-extrabold tracking-wider transition-colors font-sans border-0 ${
            isDisabled
              ? 'bg-secondary-800 text-secondary-500 cursor-not-allowed'
              : 'text-white cursor-pointer hover:opacity-90'
          }`}
        >
          {rolling ? 'Rolling…' : 'Roll Dice'}
        </button>
        <p className="mt-2 text-center text-[0.55rem] text-secondary-500 tracking-wider font-sans">
          Click or press Space
        </p>
      </div>
    </div>
  )
}
