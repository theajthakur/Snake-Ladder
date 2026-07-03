'use client'

/**
 * page.tsx — Landing / Setup screen
 *
 * 1. Select number of players (1–4)
 * 2. Enter / skip player names
 * 3. Launch → /play
 */
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import PlayerToken from '@/app/_components/PlayerToken'
import { PLAYERS } from '@/app/data/players'
import { createNewGame, saveGameState, type GamePlayer } from '@/app/_store/gameStore'

const COUNT_OPTIONS = [1, 2, 3, 4] as const

export default function LandingPage() {
  const router = useRouter()
  const [selectedCount, setSelectedCount] = useState<number>(2)
  const [names, setNames] = useState<string[]>(['', '', '', ''])

  const setName = (idx: number, val: string) =>
    setNames((prev) => Object.assign([...prev], { [idx]: val }))

  const handleSkipAll = () => setNames(['', '', '', ''])

  const handleLaunch = () => {
    const players: GamePlayer[] = Array.from(
      { length: selectedCount },
      (_, i) => ({
        id:   i as 0 | 1 | 2 | 3,
        name: names[i].trim() || PLAYERS[i].name,
      }),
    )
    saveGameState(createNewGame(players))
    router.push('/play')
  }

  return (
    <div
      style={{
        position:   'relative',
        minHeight:  '100vh',
        width:      '100vw',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow:   'hidden',
        background: '#050508',
      }}
    >
      {/* ── Blurred bg image ── */}
      <img
        src="/bg.avif"
        alt=""
        aria-hidden="true"
        style={{
          position:  'absolute',
          inset:      0,
          width:     '100%',
          height:    '100%',
          objectFit: 'cover',
          filter:    'blur(18px) brightness(0.22) saturate(1.4)',
          transform: 'scale(1.08)',
        }}
      />

      {/* ── Radial vignette ── */}
      <div
        style={{
          position:   'absolute',
          inset:       0,
          background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, #050508 90%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Card ── */}
      <div
        style={{
          position:       'relative',
          zIndex:          1,
          width:          '100%',
          maxWidth:        460,
          margin:         '0 auto',
          padding:        '40px 36px 36px',
          background:     'rgba(12, 12, 20, 0.82)',
          border:         '1px solid rgba(255,255,255,0.10)',
          borderRadius:    24,
          backdropFilter: 'blur(20px)',
          boxShadow:      '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '2.6rem', lineHeight: 1, marginBottom: 10 }}>🐍🎲</div>
          <h1
            style={{
              margin:          0,
              fontSize:       '1.9rem',
              fontWeight:      900,
              letterSpacing:  '-0.02em',
              fontFamily:     'system-ui, sans-serif',
              background:     'linear-gradient(135deg, #fff 0%, #aaa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Snake &amp; Ladder
          </h1>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
            Classic board game for 1–4 players
          </p>
        </div>

        {/* ── Player count selector ── */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display:       'block',
              marginBottom:   10,
              fontSize:      '0.65rem',
              fontWeight:     700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.40)',
            }}
          >
            Number of Players
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {COUNT_OPTIONS.map((n) => {
              const isSelected = n === selectedCount
              const accent     = PLAYERS[n - 1].color
              return (
                <button
                  key={n}
                  onClick={() => setSelectedCount(n)}
                  style={{
                    flex:           1,
                    padding:        '14px 4px',
                    borderRadius:    12,
                    border:         isSelected
                      ? `2px solid ${accent}`
                      : '2px solid rgba(255,255,255,0.10)',
                    background:     isSelected
                      ? `${accent}22`
                      : 'rgba(255,255,255,0.05)',
                    boxShadow:      isSelected
                      ? `0 0 16px ${accent}55`
                      : 'none',
                    color:          isSelected ? accent : 'rgba(255,255,255,0.45)',
                    fontSize:       '1.1rem',
                    fontWeight:     800,
                    cursor:         'pointer',
                    transition:     'all 0.2s',
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'center',
                    gap:             6,
                  }}
                >
                  <PlayerToken playerId={(n - 1) as 0 | 1 | 2 | 3} size={isSelected ? 32 : 26} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                    {n} {n === 1 ? 'Player' : 'Players'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Player name inputs ── */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              marginBottom:    10,
            }}
          >
            <label
              style={{
                fontSize:      '0.65rem',
                fontWeight:     700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.40)',
              }}
            >
              Player Names
            </label>
            <button
              onClick={handleSkipAll}
              style={{
                background:   'transparent',
                border:       '1px solid rgba(255,255,255,0.15)',
                borderRadius:  6,
                padding:      '3px 10px',
                color:        'rgba(255,255,255,0.40)',
                fontSize:     '0.7rem',
                cursor:       'pointer',
                transition:   'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.40)')}
            >
              Skip All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: selectedCount }, (_, i) => {
              const config = PLAYERS[i]
              return (
                <div
                  key={i}
                  style={{
                    display:     'flex',
                    alignItems:  'center',
                    gap:          10,
                    background:  'rgba(255,255,255,0.04)',
                    border:      `1px solid rgba(255,255,255,0.09)`,
                    borderRadius: 10,
                    padding:     '8px 12px',
                    transition:  'border-color 0.2s',
                  }}
                >
                  <PlayerToken playerId={i as 0 | 1 | 2 | 3} size={28} />
                  <input
                    id={`player-name-${i}`}
                    type="text"
                    maxLength={20}
                    value={names[i]}
                    placeholder={config.name}
                    onChange={(e) => setName(i, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
                    style={{
                      flex:        1,
                      background:  'transparent',
                      border:      'none',
                      outline:     'none',
                      color:       '#fff',
                      fontSize:    '0.9rem',
                      fontWeight:   600,
                      fontFamily:  'system-ui, sans-serif',
                      caretColor:  config.color,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Launch button ── */}
        <button
          onClick={handleLaunch}
          style={{
            width:          '100%',
            padding:        '16px',
            borderRadius:    14,
            border:         'none',
            background:     'linear-gradient(135deg, #6c3fff 0%, #b83fff 100%)',
            boxShadow:      '0 8px 28px rgba(108,63,255,0.45)',
            color:          '#fff',
            fontSize:       '1rem',
            fontWeight:      800,
            letterSpacing:  '0.04em',
            cursor:         'pointer',
            transition:     'transform 0.15s, box-shadow 0.15s',
            fontFamily:     'system-ui, sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform  = 'translateY(-2px)'
            e.currentTarget.style.boxShadow  = '0 12px 36px rgba(108,63,255,0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform  = 'translateY(0)'
            e.currentTarget.style.boxShadow  = '0 8px 28px rgba(108,63,255,0.45)'
          }}
        >
          🎮 &nbsp;Launch Game
        </button>
      </div>
    </div>
  )
}