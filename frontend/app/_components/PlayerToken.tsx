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
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
    >
      <defs>
        {/* Radial gradient: highlight top-left → shadow bottom-right */}
        <radialGradient id={gradId} cx="35%" cy="30%" r="65%" fx="35%" fy="30%">
          <stop offset="0%"   stopColor={player.highlight} stopOpacity={1} />
          <stop offset="55%"  stopColor={player.color}     stopOpacity={1} />
          <stop offset="100%" stopColor={player.shadow}    stopOpacity={1} />
        </radialGradient>

        {/* Drop-shadow filter */}
        <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* Dark outline ring */}
      <circle
        cx={cx} cy={cy} r={innerR}
        fill={`url(#${gradId})`}
        stroke="#111" strokeWidth={stroke}
        filter={`url(#${shadowId})`}
      />

      {/* Inner gloss highlight (top arc) */}
      <ellipse
        cx={cx} cy={cy - innerR * 0.2}
        rx={innerR * 0.45} ry={innerR * 0.22}
        fill="rgba(255,255,255,0.30)"
      />

      {/* Player label */}
      <text
        x={cx} y={cy}
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={size * 0.3}
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
        fill="#fff"
        stroke="#000"
        strokeWidth="0.6"
        paintOrder="stroke"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {displayLabel}
      </text>
    </svg>
  )
}
