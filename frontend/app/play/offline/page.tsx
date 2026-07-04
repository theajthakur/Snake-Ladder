'use client'

/**
 * app/play/offline/page.tsx — Offline Game board + dice + animation
 *
 * Animation phases after dice settles:
 *  1. Marker steps cell-by-cell to raw position (180 ms/cell)
 *  2. If snake/ladder: pause → straight-line CSS slide to resolved position
 *  3. Commit to gameState + nextTurn
 *
 * VisualState drives all visual overrides:
 *  'idle'     → grid renders from gameState.positions
 *  'stepping' → grid renders player at intermediate pos
 *  'sliding'  → grid hides player (SlidingToken takes over)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ContainRect } from '@/app/_utils/boardGeometry'
import {
  loadGameState,
  saveGameState,
  currentPlayer,
  nextTurn,
  movePlayer,
  type GameState,
} from '@/app/_store/gameStore'
import { resolveCell, snakeMap, ladderMap } from '@/app/data/boardData'

import BoardBackground from '@/app/_components/BoardBackground'
import BoardGrid, { type BoardPrediction } from '@/app/_components/BoardGrid'
import PlayerPanel from '@/app/_components/PlayerPanel'
import DiceRoller from '@/app/_components/DiceRoller'
import SlidingToken from '@/app/_components/SlidingToken'
import PredictionPanel from '@/app/_components/PredictionPanel'
import { soundManager } from '@/app/_utils/sound'
import SoundToggleButton from '@/app/_components/SoundToggleButton'
import GamingButton from '@/app/_components/GamingButton'
import { Trophy, Home } from 'lucide-react'


// ── Timing constants ─────────────────────────────────────────────────────────
const STEP_MS = 180   // delay between each stepped cell
const SLIDE_PAUSE_MS = 380   // pause at snake-head / ladder-bottom before slide
const SETTLE_MS = 220   // hold at final cell before committing state

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// ── Visual state ─────────────────────────────────────────────────────────────
type VisualState =
  | { type: 'idle' }
  | { type: 'stepping'; playerId: number; pos: number }
  | { type: 'sliding'; playerId: number; fromCell: number; toCell: number }

export default function OfflinePlayPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const [gridRect, setGridRect] = useState<ContainRect | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [visualState, setVisualState] = useState<VisualState>({ type: 'idle' })
  const [diceValue, setDiceValue] = useState<number>(1)
  const [diceRolling, setDiceRolling] = useState(false)

  // Stable refs so async closures read current values without stale captures
  const gsRef = useRef<GameState | null>(null)
  const busyRef = useRef(false)
  const slideResolveRef = useRef<(() => void) | null>(null)

  useEffect(() => { gsRef.current = gameState }, [gameState])
  useEffect(() => { busyRef.current = busy }, [busy])

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = loadGameState()
    if (!s) { router.replace('/'); return }
    setGameState(s)
  }, [router])

  // ── Persist ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState) saveGameState(gameState)
  }, [gameState])

  // ── Dice rolling sound control ─────────────────────────────────────────────
  useEffect(() => {
    if (diceRolling) {
      soundManager.playDiceRoll()
    } else {
      soundManager.stopDiceRoll()
    }
  }, [diceRolling])

  // ── Slide done callback ───────────────────────────────────────────────────
  const handleSlideDone = useCallback(() => {
    slideResolveRef.current?.()
    slideResolveRef.current = null
  }, [])

  // ── Roll handler ──────────────────────────────────────────────────────────
  const handleRoll = useCallback(async () => {
    if (busyRef.current) return
    const state = gsRef.current
    if (!state) return

    setBusy(true)
    setDiceRolling(true)

    // Visual roll animation (800ms fast spin)
    await wait(800)

    const player = currentPlayer(state)
    const pos = state.positions[player.id]
    const isLocked = pos === 0
    const picker = isLocked
      ? () => Math.random() < 1 / 3 ? 6 : (Math.floor(Math.random() * 5) + 1)
      : () => Math.floor(Math.random() * 6) + 1
    const diceVal = Math.min(6, Math.max(1, Math.round(picker()))) as 1 | 2 | 3 | 4 | 5 | 6

    setDiceValue(diceVal)
    setDiceRolling(false)

    // Settle animation (200ms ease-out)
    await wait(200)

    // ── Locked: need 6 to enter ───────────────────────────────────────────
    if (pos === 0) {
      if (diceVal !== 6) {
        await wait(500)
        setGameState((s) => s ? nextTurn(s) : s)
        setBusy(false)
        return
      }
      // Pop-in at cell 1
      soundManager.play('firstSix')
      setVisualState({ type: 'stepping', playerId: player.id, pos: 1 })
      await wait(500)
      setVisualState({ type: 'idle' })
      setGameState((s) => s ? nextTurn(movePlayer(s, player.id, 1)) : s)
      setBusy(false)
      return
    }

    // ── On board ─────────────────────────────────────────────────────────
    const raw = pos + diceVal
    if (raw > 100) {
      await wait(400)
      setGameState((s) => s ? nextTurn(s) : s)
      setBusy(false)
      return
    }

    // Step cell-by-cell to raw destination
    for (let p = pos + 1; p <= raw; p++) {
      setVisualState({ type: 'stepping', playerId: player.id, pos: p })
      soundManager.play('step')
      await wait(STEP_MS)
    }

    const resolved = resolveCell(raw)

    if (resolved !== raw) {
      // Pause at snake-head / ladder-bottom so player sees what happened
      await wait(SLIDE_PAUSE_MS)

      // Play ladder or snake sound
      if (resolved > raw) {
        soundManager.play('ladder')
      } else {
        soundManager.play('snake')
      }

      // CSS straight-line slide to resolved cell
      await new Promise<void>((resolve) => {
        slideResolveRef.current = resolve
        // 'sliding' hides token from grid — SlidingToken shows it instead
        setVisualState({ type: 'sliding', playerId: player.id, fromCell: raw, toCell: resolved })
      })
    }

    // Brief settle pause then commit
    await wait(SETTLE_MS)
    setVisualState({ type: 'idle' })

    if (resolved === 100) {
      setWinner(player.name)
      soundManager.play('win')
      setGameState((s) => s ? movePlayer(s, player.id, 100) : s)
    } else {
      setGameState((s) => s ? nextTurn(movePlayer(s, player.id, resolved)) : s)
    }

    setBusy(false)
  }, [])   // stable: reads state via refs

  // ── Render guards ─────────────────────────────────────────────────────────
  if (!gameState) return null

  const active = currentPlayer(gameState)
  const isLocked = gameState.positions[active.id] === 0

  // Calculate predictions for the current player in range [2, 6]
  const currentPos = gameState.positions[active.id]
  const predictions: BoardPrediction[] = []

  if (currentPos > 0) {
    for (let d = 2; d <= 6; d++) {
      const target = currentPos + d
      if (target <= 100) {
        if (snakeMap[target] !== undefined) {
          predictions.push({
            diceValue: d,
            targetCell: target,
            resolvedCell: snakeMap[target],
            type: 'snake',
          })
        } else if (ladderMap[target] !== undefined) {
          predictions.push({
            diceValue: d,
            targetCell: target,
            resolvedCell: ladderMap[target],
            type: 'ladder',
          })
        }
      }
    }
  }

  // Build display positions from visual state
  const displayPositions: Record<number, number> = { ...gameState.positions }
  if (visualState.type === 'stepping') {
    displayPositions[visualState.playerId] = visualState.pos
  } else if (visualState.type === 'sliding') {
    displayPositions[visualState.playerId] = 0   // hide from grid
  }



  return (
    <div className="w-screen h-screen overflow-hidden m-0 p-0 bg-secondary-900 flex flex-row">
      {/* ── Left main body: Board Container ── */}
      <div
        ref={containerRef}
        className="flex-1 min-w-0 h-full relative flex items-center justify-center bg-secondary-950 p-4"
      >
        {/* Top-left controls: Sound toggle & Home button */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            title="Go to Home"
            className="flex items-center justify-center bg-secondary-900 border border-secondary-700 hover:border-secondary-600 rounded-xl p-2.5 shadow-sm text-secondary-300 hover:text-secondary-100 cursor-pointer transition-all duration-200"
          >
            <Home size={18} strokeWidth={2.5} />
          </button>
          <SoundToggleButton />
        </div>

        {/* Board image */}
        <BoardBackground
          src="/bg.avif"
          containerRef={containerRef}
          onRectChange={setGridRect}
        />

        {/* Grid + stepped tokens */}
        {gridRect && (
          <BoardGrid
            rect={gridRect}
            positions={displayPositions}
            players={gameState.players}
            predictions={predictions}
          />
        )}

        {/* Straight-line slide for snake / ladder */}
        {visualState.type === 'sliding' && gridRect && (
          <SlidingToken
            playerId={visualState.playerId as 0 | 1 | 2 | 3}
            fromCell={visualState.fromCell}
            toCell={visualState.toCell}
            rect={gridRect}
            onDone={handleSlideDone}
          />
        )}
      </div>

      {/* ── Right side: Sidebar ── */}
      <div className="w-80 h-full border-l border-secondary-800 bg-secondary-900 flex flex-col p-4 gap-4 overflow-y-auto select-none shrink-0 justify-between">
        <div className="flex flex-col gap-4">
          <PlayerPanel players={gameState.players} currentPlayerId={active.id} />
          
          {!winner && (
            <DiceRoller
              currentPlayer={active}
              value={diceValue}
              rolling={diceRolling}
              onRoll={handleRoll}
              disabled={busy}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          {!winner && (
            <PredictionPanel predictions={predictions} activePlayerId={active.id} />
          )}
        </div>
      </div>

      {/* ── Win overlay ── */}
      {winner && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-secondary-900/90 gap-5 select-none">
          <Trophy size={64} className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)] animate-bounce" />
          <h2 className="m-0 text-3xl font-black text-primary-500 text-center font-sans tracking-wide uppercase">
            {winner} wins!
          </h2>
          <GamingButton
            onClick={() => router.push('/')}
            theme="golden"
            size="lg"
            className="mt-2"
          >
            New Game
          </GamingButton>
        </div>
      )}
    </div>
  )
}
