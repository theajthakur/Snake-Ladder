'use client'

/**
 * DiceRoller.tsx
 *
 * Fixed right-side dice panel.
 * - SVG dice face with dot layout
 * - "Lottery machine" animation (fast → slow → final)
 * - Click or Space to roll
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PLAYERS } from '@/app/data/players'
import PlayerToken from '@/app/_components/PlayerToken'
import type { GamePlayer } from '@/app/_store/gameStore'

// ── Dot positions per face (as 0-1 fractions of viewBox 0-100) ──────────────
const DOTS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.72, 0.28], [0.28, 0.72]],
  3: [[0.72, 0.28], [0.5, 0.5], [0.28, 0.72]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
  6: [
    [0.28, 0.22], [0.28, 0.5], [0.28, 0.78],
    [0.72, 0.22], [0.72, 0.5], [0.72, 0.78],
  ],
}

// ── SVG Dice Face ────────────────────────────────────────────────────────────
function DiceFace({
  value,
  size,
  color,
  rolling,
}: {
  value: number
  size: number
  color: string
  rolling: boolean
}) {
  const dots  = DOTS[value] ?? DOTS[1]
  const dotR  = 7   // dot radius in SVG units

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        display:    'block',
        borderRadius: '18%',
        filter:     rolling
          ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 6px ${color})`
          : `drop-shadow(0 0 6px ${color}66)`,
        transition: 'filter 0.15s',
        animation:  rolling ? 'diceShake 0.08s ease-in-out infinite alternate' : 'none',
      }}
    >
      {/* Face */}
      <rect
        x="2" y="2" width="96" height="96" rx="18" ry="18"
        fill="#0c0c1a"
        stroke={color}
        strokeWidth="3.5"
      />

      {/* Dots */}
      {dots.map(([fx, fy], i) => (
        <circle
          key={i}
          cx={fx * 100}
          cy={fy * 100}
          r={dotR}
          fill={color}
          style={{
            filter: `drop-shadow(0 0 ${rolling ? 5 : 3}px ${color})`,
            transition: 'r 0.1s',
          }}
        />
      ))}
    </svg>
  )
}

// ── DiceRoller panel ─────────────────────────────────────────────────────────
export interface DiceRollerProps {
  currentPlayer: GamePlayer
  onRoll: (value: number) => void
  /** Disable rolling while move animation / state update is in progress */
  disabled?: boolean
  /**
   * Optional override for how the final dice value is chosen.
   * Defaults to a uniform random 1-6.
   * Use this to bias the result (e.g. 1/3 chance of 6 for locked players).
   */
  getFinalValue?: () => number
}

export default function DiceRoller({
  currentPlayer,
  onRoll,
  disabled = false,
  getFinalValue,
}: DiceRollerProps) {
  const config    = PLAYERS[currentPlayer.id]
  const [rolling, setRolling]      = useState(false)
  const [display, setDisplay]      = useState<number>(1)
  const timeoutRef                 = useRef<ReturnType<typeof setTimeout> | null>(null)

  const roll = useCallback(() => {
    if (rolling || disabled) return

    const picker = getFinalValue ?? (() => Math.floor(Math.random() * 6) + 1)
    const final  = Math.min(6, Math.max(1, Math.round(picker()))) as 1|2|3|4|5|6
    setRolling(true)

    const TOTAL_STEPS = 16

    const tick = (step: number) => {
      setDisplay(Math.floor(Math.random() * 6) + 1)

      if (step < TOTAL_STEPS) {
        // Exponential ease-out: 18ms → ~168ms, total ≈ 880ms
        const t     = step / TOTAL_STEPS
        const delay = 18 + Math.pow(t, 3) * 150
        timeoutRef.current = setTimeout(() => tick(step + 1), delay)
      } else {
        setDisplay(final)
        setRolling(false)
        onRoll(final)
      }
    }

    timeoutRef.current = setTimeout(() => tick(0), 18)
  }, [rolling, disabled, onRoll])

  // Space-bar listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        roll()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [roll])

  // Cleanup
  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const isDisabled = rolling || disabled

  return (
    <div
      style={{
        position:       'fixed',
        right:           16,
        top:            '50%',
        transform:      'translateY(-50%)',
        zIndex:          999,
        width:           164,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        background:     'rgba(6, 6, 18, 0.85)',
        border:         `1px solid ${config.color}44`,
        borderRadius:    20,
        backdropFilter: 'blur(16px)',
        boxShadow:      `0 12px 40px rgba(0,0,0,0.65), 0 0 28px ${config.color}1a`,
        overflow:       'hidden',
        transition:     'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        width:          '100%',
        padding:        '10px 14px',
        borderBottom:   '1px solid rgba(255,255,255,0.07)',
        fontSize:       '0.58rem',
        fontWeight:      700,
        letterSpacing:  '0.14em',
        textTransform:  'uppercase',
        color:          'rgba(255,255,255,0.30)',
        display:        'flex',
        alignItems:     'center',
        gap:             6,
        boxSizing:      'border-box',
      }}>
        🎲&nbsp; Dice
      </div>

      {/* ── Current player ── */}
      <div style={{
        width:          '100%',
        padding:        '9px 12px',
        borderBottom:   '1px solid rgba(255,255,255,0.06)',
        display:        'flex',
        alignItems:     'center',
        gap:             8,
        boxSizing:      'border-box',
      }}>
        <PlayerToken playerId={currentPlayer.id} size={26} />
        <span style={{
          fontSize:      '0.78rem',
          fontWeight:     700,
          color:          config.color,
          textShadow:    `0 0 8px ${config.color}66`,
          fontFamily:    'system-ui, sans-serif',
          overflow:      'hidden',
          textOverflow:  'ellipsis',
          whiteSpace:    'nowrap',
          flex:           1,
        }}>
          {currentPlayer.name}
        </span>
      </div>

      {/* ── Dice face ── */}
      <div style={{ padding: '22px 0 16px' }}>
        <DiceFace value={display} size={100} color={config.color} rolling={rolling} />
      </div>

      {/* ── Roll button ── */}
      <div style={{ width: '100%', padding: '0 14px 14px', boxSizing: 'border-box' }}>
        <button
          id="roll-dice-btn"
          onClick={roll}
          disabled={isDisabled}
          style={{
            width:          '100%',
            padding:        '11px 0',
            borderRadius:    10,
            border:         'none',
            background:     isDisabled
              ? 'rgba(255,255,255,0.06)'
              : `linear-gradient(135deg, ${config.color}, ${config.shadow})`,
            boxShadow:      isDisabled ? 'none' : `0 4px 18px ${config.color}55`,
            color:          isDisabled ? 'rgba(255,255,255,0.22)' : '#fff',
            fontSize:       '0.82rem',
            fontWeight:      800,
            letterSpacing:  '0.05em',
            cursor:         isDisabled ? 'not-allowed' : 'pointer',
            transition:     'all 0.2s',
            fontFamily:     'system-ui, sans-serif',
          }}
        >
          {rolling ? 'Rolling…' : 'Roll Dice'}
        </button>
        <p style={{
          margin:         '7px 0 0',
          textAlign:      'center',
          fontSize:       '0.56rem',
          color:          'rgba(255,255,255,0.22)',
          letterSpacing:  '0.04em',
        }}>
          Click or press Space
        </p>
      </div>

      {/* Keyframe for shake animation */}
      <style>{`
        @keyframes diceShake {
          from { transform: rotate(-5deg) scale(0.96); }
          to   { transform: rotate(5deg)  scale(1.04); }
        }
      `}</style>
    </div>
  )
}
