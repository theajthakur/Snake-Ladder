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
    <div
      style={{
        position:       'fixed',
        bottom:          16,
        right:           16,
        zIndex:          999,
        width:           240,
        background:     'rgba(6, 6, 18, 0.85)',
        border:         `1px solid rgba(255, 255, 255, 0.12)`,
        borderRadius:    16,
        backdropFilter: 'blur(16px)',
        boxShadow:      '0 8px 32px rgba(0,0,0,0.65)',
        overflow:       'hidden',
        boxSizing:      'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding:       '10px 14px',
          borderBottom:  '1px solid rgba(255,255,255,0.07)',
          fontSize:      '0.60rem',
          fontWeight:     700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.40)',
          display:        'flex',
          alignItems:     'center',
          gap:             6,
        }}
      >
        🔮 Turn Predictions (Range 2–6)
      </div>

      {/* Body List */}
      <div
        style={{
          padding:        '12px',
          display:        'flex',
          flexDirection:  'column',
          gap:             8,
          maxHeight:       160,
          overflowY:      'auto',
        }}
      >
        {predictions.length === 0 ? (
          <div
            style={{
              fontSize:   '0.75rem',
              color:      'rgba(255,255,255,0.35)',
              textAlign:  'center',
              padding:    '12px 0',
              fontStyle:  'italic',
            }}
          >
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
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  gap:             4,
                  background:     isLadder
                    ? 'rgba(46, 204, 64, 0.10)'
                    : 'rgba(255, 59, 59, 0.10)',
                  border:         `1px solid ${
                    isLadder ? 'rgba(46, 204, 64, 0.25)' : 'rgba(255, 59, 59, 0.25)'
                  }`,
                  borderRadius:    8,
                  padding:        '8px 10px',
                  boxShadow:      isLadder
                    ? '0 2px 8px rgba(46, 204, 64, 0.05)'
                    : '0 2px 8px rgba(255, 59, 59, 0.05)',
                  transition:     'transform 0.2s',
                }}
              >
                {/* Roll & Cell info */}
                <div
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize:   '0.75rem',
                      fontWeight: 800,
                      color:      isLadder ? '#2ECC40' : '#FF3B3B',
                      textShadow: `0 0 6px ${isLadder ? '#2ECC4044' : '#FF3B3B44'}`,
                    }}
                  >
                    🎲 Roll {p.diceValue}
                  </span>
                  <span
                    style={{
                      fontSize:   '0.62rem',
                      fontWeight: 700,
                      color:      'rgba(255,255,255,0.45)',
                      background: 'rgba(0,0,0,0.4)',
                      padding:    '1px 4px',
                      borderRadius: 3,
                    }}
                  >
                    Land: {p.targetCell}
                  </span>
                </div>

                {/* Outcome */}
                <div
                  style={{
                    fontSize:   '0.70rem',
                    color:      'rgba(255,255,255,0.8)',
                    display:    'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  <span>
                    {isLadder ? '🪜 Climb to ' : '🐍 Slide to '}
                    <strong style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                      {p.resolvedCell}
                    </strong>
                  </span>
                  <span
                    style={{
                      fontWeight: 900,
                      color:      isLadder ? '#2ECC40' : '#FF3B3B',
                    }}
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
