// ─────────────────────────────────────────────
//  PlayerToken — reusable board-game piece
// ─────────────────────────────────────────────
import React from 'react'
import { PLAYERS, type PlayerConfig } from '@/app/data/players'

export interface PlayerTokenProps {
  /** 0-indexed player id (0–3) */
  playerId: 0 | 1 | 2 | 3
  /** Diameter of the token in px. Default: 32 */
  size?: number
  /** Override the default label (P1, P2 …) */
  label?: string
  /** Extra inline styles on the root <svg> */
  style?: React.CSSProperties
  className?: string
}

/**
 * A circular SVG board-game token with:
 *  - player-specific colour + gloss gradient
 *  - dark outline / stroke
 *  - drop shadow
 *  - centred player label
 *
 * Usage:
 *   <PlayerToken playerId={0} size={36} />
 */
export default function PlayerToken({
  playerId,
  size = 32,
  label,
  style,
  className,
}: PlayerTokenProps) {
  const player: PlayerConfig = PLAYERS[playerId]
  const r      = size / 2
  const cx     = r
  const cy     = r
  const stroke = 2.5
  const innerR = r - stroke / 2 - 0.5

  const gradId       = `token-grad-${playerId}`
  const shadowId     = `token-shadow-${playerId}`
  const displayLabel = label ?? `P${playerId + 1}`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={player.name}
      style={{ ...style }}
      className={`block shrink-0 ${className || ''}`}
    >
      {/* Flat circular disk */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill={player.color}
        stroke="#1c1917"
        strokeWidth={stroke}
      />

      {/* Player label */}
      <text
        x={cx}
        y={cy}
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={size * 0.32}
        fontWeight="800"
        fill="#ffffff"
        stroke="#1c1917"
        strokeWidth="0.8"
        paintOrder="stroke"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
        className="font-sans"
      >
        {displayLabel}
      </text>
    </svg>
  )
}
