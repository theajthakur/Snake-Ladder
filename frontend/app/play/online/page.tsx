'use client'

/**
 * app/play/online/page.tsx — Online Multiplayer Game board + dice + animation
 *
 * Connects to the backend FastAPI server to sync board states in real-time.
 */
import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ContainRect } from '@/app/_utils/boardGeometry'
import { resolveCell, snakeMap, ladderMap } from '@/app/data/boardData'
import { PLAYERS } from '@/app/data/players'
import {
  startGame as apiStartGame,
  joinGame as apiJoinGame,
  throwDice as apiThrowDice,
  getSystemStatus,
  type PlayerStatus,
  type GameState,
} from '@/lib/game'

import BoardBackground    from '@/app/_components/BoardBackground'
import BoardGrid, { type BoardPrediction } from '@/app/_components/BoardGrid'
import PlayerPanel        from '@/app/_components/PlayerPanel'
import DiceRoller         from '@/app/_components/DiceRoller'
import SlidingToken       from '@/app/_components/SlidingToken'
import PredictionPanel    from '@/app/_components/PredictionPanel'
import { soundManager } from '@/app/_utils/sound'
import SoundToggleButton from '@/app/_components/SoundToggleButton'
import GamingButton from '@/app/_components/GamingButton'
import { Globe, Dices, AlertTriangle, Trophy, Home } from 'lucide-react'


const STEP_MS        = 180
const SLIDE_PAUSE_MS = 380
const SETTLE_MS      = 220

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

type VisualState =
  | { type: 'idle' }
  | { type: 'stepping'; playerId: string; pos: number }
  | { type: 'sliding';  playerId: string; fromCell: number; toCell: number }

function OnlinePlayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [gameId, setGameId] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  const [gridRect, setGridRect] = useState<ContainRect | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [visualState, setVisualState] = useState<VisualState>({ type: 'idle' })

  const [joinInput, setJoinInput] = useState('')
  const [playerCount, setPlayerCount] = useState<number>(2)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [diceValue, setDiceValue] = useState<number>(1)
  const [diceRolling, setDiceRolling] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const gsRef = useRef<GameState | null>(null)
  const busyRef = useRef(false)
  const slideResolveRef = useRef<(() => void) | null>(null)
  const lastRollAnimatedRef = useRef<{ player: string; value: number } | null>(null)

  useEffect(() => { gsRef.current = gameState }, [gameState])
  useEffect(() => { busyRef.current = busy }, [busy])

  // Sync state from query params on mount
  useEffect(() => {
    const gid = searchParams.get('game_id')
    const pid = searchParams.get('player_id')
    if (gid) setGameId(gid)
    if (pid) setPlayerId(pid)
  }, [searchParams])

  // ── Dice rolling sound control ─────────────────────────────────────────────
  useEffect(() => {
    if (diceRolling) {
      soundManager.playDiceRoll()
    } else {
      soundManager.stopDiceRoll()
    }
  }, [diceRolling])

  // Poll backend for game status updates
  useEffect(() => {
    if (!gameId) return

    const poll = async () => {
      // Don't poll if we're actively running an animation or a local roll
      if (busyRef.current) return

      try {
        const response = await getSystemStatus()
        
        // Double check busy flag after await to avoid overwriting state during user action
        if (busyRef.current) {
          console.log("[POLL] Discarding in-flight poll response because UI became busy")
          return
        }

        const activeGame = response.game[gameId]
        if (activeGame) {
          const prevGame = gsRef.current
          if (prevGame) {
            const hasNewRoll =
              activeGame.last_roll_player &&
              activeGame.last_roll_player !== playerId &&
              (lastRollAnimatedRef.current?.player !== activeGame.last_roll_player ||
               lastRollAnimatedRef.current?.value !== activeGame.last_roll_value)

            if (hasNewRoll) {
              // Mark this roll as animated immediately
              lastRollAnimatedRef.current = {
                player: activeGame.last_roll_player,
                value: activeGame.last_roll_value
              }

              setBusy(true)

              const playerToAnimate = activeGame.last_roll_player
              const rollVal = activeGame.last_roll_value

              const oldPos = prevGame.player_statuses[playerToAnimate]?.position ?? 0
              const targetPos = activeGame.player_statuses[playerToAnimate]?.position ?? 0

              // 1. Show dice value immediately (no delay — API already returned it)
              setDiceValue(rollVal)
              setDiceRolling(false)

              // 2. Animate the player's token stepping cell-by-cell
              if (targetPos !== oldPos) {
                if (oldPos === 0 && rollVal === 6) {
                  soundManager.play('firstSix')
                  setVisualState({ type: 'stepping', playerId: playerToAnimate, pos: 1 })
                  await wait(500)
                  setVisualState({ type: 'idle' })
                } else if (oldPos > 0) {
                  const rawDest = oldPos + rollVal
                  for (let p = oldPos + 1; p <= Math.min(rawDest, 100); p++) {
                    setVisualState({ type: 'stepping', playerId: playerToAnimate, pos: p })
                    soundManager.play('step')
                    await wait(STEP_MS)
                  }

                  // CSS slide for snakes / ladders
                  if (targetPos !== rawDest && rawDest <= 100) {
                    await wait(SLIDE_PAUSE_MS)
                    
                    // Play ladder or snake sound
                    if (targetPos > rawDest) {
                      soundManager.play('ladder')
                    } else {
                      soundManager.play('snake')
                    }

                    await new Promise<void>((resolve) => {
                      slideResolveRef.current = resolve
                      setVisualState({ type: 'sliding', playerId: playerToAnimate, fromCell: rawDest, toCell: targetPos })
                    })
                  }
                }

                if (targetPos === 100) {
                  soundManager.play('win')
                }
              }

              await wait(SETTLE_MS)
              setVisualState({ type: 'idle' })
            }
          } else {
            // Initial load of game: initialize lastRollAnimatedRef so we don't replay the past roll
            if (activeGame.last_roll_player) {
              lastRollAnimatedRef.current = {
                player: activeGame.last_roll_player,
                value: activeGame.last_roll_value
              }
            }
          }

          // Apply state update
          setGameState(activeGame)
          if (activeGame.winner) {
            setWinner(activeGame.winner === playerId ? "You" : `Player ${activeGame.winner.slice(0, 4)}`)
          }
          setBusy(false)
        } else {
          setErrorMsg("Game session not found on server")
        }
      } catch (err: any) {
        console.error("Polling error:", err)
      }
    }

    poll() // Initial fetch
    const interval = setInterval(poll, 2000)
    return () => clearInterval(interval)
  }, [gameId, playerId])

  const handleSlideDone = useCallback(() => {
    slideResolveRef.current?.()
    slideResolveRef.current = null
  }, [])

  // Create Lobby
  const handleHost = async () => {
    setErrorMsg(null)
    try {
      const gameRes = await apiStartGame(playerCount)
      const playerRes = await apiJoinGame(gameRes.game_id)
      
      const nextGid = gameRes.game_id
      const nextPid = playerRes.game.player_id
      
      setGameId(nextGid)
      setPlayerId(nextPid)
      
      router.replace(`/play/online?game_id=${nextGid}&player_id=${nextPid}`)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to host lobby")
    }
  }

  // Join existing lobby
  const handleJoin = async () => {
    if (!joinInput.trim()) return
    setErrorMsg(null)
    try {
      const playerRes = await apiJoinGame(joinInput.trim())
      const nextPid = playerRes.game.player_id
      const nextGid = joinInput.trim()

      setGameId(nextGid)
      setPlayerId(nextPid)
      
      router.replace(`/play/online?game_id=${nextGid}&player_id=${nextPid}`)
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to join lobby")
    }
  }

  // Triggered when clicking dice — calls backend to throw the dice
  const handleRoll = useCallback(async () => {
    if (busyRef.current || !gameId || !playerId || !gameState) return
    setBusy(true)
    setDiceRolling(true)
    setErrorMsg(null)

    try {
      const res = await apiThrowDice(gameId, playerId)
      const rollVal = res.game.value
      const targetPos = res.game.position
      const nextTurnPlayer = res.game.turn

      // Show exact API value immediately
      setDiceValue(rollVal)
      setDiceRolling(false)

      const pStatus = gameState.player_statuses[playerId]
      const oldPos = pStatus ? pStatus.position : 0

      // Animate: Activation entry
      if (oldPos === 0 && rollVal === 6) {
        soundManager.play('firstSix')
        setVisualState({ type: 'stepping', playerId, pos: 1 })
        await wait(500)
        setVisualState({ type: 'idle' })
      } else if (oldPos > 0) {
        // Step cell by cell
        const rawDest = oldPos + rollVal
        for (let p = oldPos + 1; p <= Math.min(rawDest, 100); p++) {
          setVisualState({ type: 'stepping', playerId, pos: p })
          soundManager.play('step')
          await wait(STEP_MS)
        }

        // CSS slide for snakes / ladders
        if (targetPos !== rawDest && rawDest <= 100) {
          await wait(SLIDE_PAUSE_MS)
          
          // Play ladder or snake sound
          if (targetPos > rawDest) {
            soundManager.play('ladder')
          } else {
            soundManager.play('snake')
          }

          await new Promise<void>((resolve) => {
            slideResolveRef.current = resolve
            setVisualState({ type: 'sliding', playerId, fromCell: rawDest, toCell: targetPos })
          })
        }
      }

      await wait(SETTLE_MS)
      setVisualState({ type: 'idle' })

      // Settle turn and position locally so indicator updates gracefully
      setGameState((s) => {
        if (!s) return s
        const updatedPlayers = { ...s.player_statuses }
        if (updatedPlayers[playerId]) {
          updatedPlayers[playerId] = {
            ...updatedPlayers[playerId],
            position: targetPos,
          }
        }

        // Map the 1-based index (e.g. "2") returned by the server back to player UUID
        const playerUuids = Object.keys(s.player_statuses)
        const nextTurnIdx = parseInt(nextTurnPlayer) - 1
        const nextTurnUuid = playerUuids[nextTurnIdx] || s.current_turn

        return {
          ...s,
          player_statuses: updatedPlayers,
          current_turn: nextTurnUuid,
        }
      })

      if (targetPos === 100) {
        setWinner("You")
        soundManager.play('win')
      }
    } catch (err: any) {
      setDiceRolling(false)
      setErrorMsg(err.message || "Failed executing movement.")
    } finally {
      setBusy(false)
    }
  }, [gameId, playerId, gameState])

  // Lobby view before game details are loaded
  if (!gameId || !playerId) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-secondary-900 p-4 font-sans text-secondary-100">
        <div className="relative z-10 w-full max-w-md bg-secondary-800 border border-secondary-700 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="flex justify-center gap-3.5 mb-3 text-primary-500">
              <Globe size={40} />
              <Dices size={40} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-secondary-100 uppercase">
              Online Multiplayer
            </h1>
            <p className="text-xs text-secondary-400 mt-2 font-medium">
              Join or host a game session on the server
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 text-xs bg-primary-950/20 border border-primary-800/40 text-primary-400 rounded-lg font-bold flex items-center gap-1.5">
              <AlertTriangle size={12} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Host Setup */}
          <div className="mb-6 pb-6 border-b border-secondary-700/50">
            <h2 className="text-xs font-bold text-secondary-300 uppercase tracking-wide mb-3">
              Host a new game
            </h2>
            <div className="flex gap-2 mb-3">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                    playerCount === count
                      ? 'border-primary-500 bg-primary-950/20 text-primary-400'
                      : 'border-secondary-700 bg-secondary-900/50 text-secondary-400 hover:border-secondary-600'
                  }`}
                >
                  {count} Players
                </button>
              ))}
            </div>
            <button
              onClick={handleHost}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white text-xs font-extrabold tracking-wider rounded-xl cursor-pointer transition-colors border-0"
            >
              Host Session
            </button>
          </div>

          {/* Join Setup */}
          <div>
            <h2 className="text-xs font-bold text-secondary-300 uppercase tracking-wide mb-3">
              Join existing game
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                placeholder="Enter Session UUID"
                className="flex-1 bg-secondary-900 border border-secondary-700 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-secondary-600 text-white"
              />
              <button
                onClick={handleJoin}
                className="px-5 bg-secondary-700 hover:bg-secondary-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors border-0"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Waiting screen if lobby is not full
  if (gameState && !gameState.game_started) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-secondary-900 p-4 font-sans text-secondary-100">
        <div className="relative z-10 w-full max-w-md bg-secondary-800 border border-secondary-700 rounded-2xl p-8 shadow-sm text-center">
          <div className="text-4xl mb-4 animate-bounce">⏳</div>
          <h1 className="text-xl font-black mb-2">Waiting for Players...</h1>
          <p className="text-xs text-secondary-400 mb-6 font-medium">
            Lobby limit: {gameState.player_size} players
          </p>

          <div className="bg-secondary-900 p-3.5 border border-secondary-700 rounded-xl mb-6 text-left">
            <span className="text-[0.6rem] font-bold text-secondary-500 uppercase tracking-wider block mb-1">
              Invite Code (Game ID)
            </span>
            <code className="text-xs font-mono font-bold text-primary-400 select-all block break-all">
              {gameId}
            </code>
          </div>

          <div className="text-xs text-secondary-500 font-bold uppercase tracking-wider">
            Connected: {Object.keys(gameState.player_statuses).length} / {gameState.player_size}
          </div>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-secondary-900 font-sans text-secondary-400 text-xs italic">
        Connecting to game server...
      </div>
    )
  }

  const isMyTurn = gameState.current_turn === playerId
  const myStatus = gameState.player_statuses[playerId]
  const currentPos = myStatus ? myStatus.position : 0
  const isLocked = currentPos === 0

  // Format data for standard UI components
  const formatPlayers = Object.keys(gameState.player_statuses).map((pid, idx) => ({
    id: idx as 0 | 1 | 2 | 3,
    name: `Player ${pid.slice(0, 4)}${pid === playerId ? ' (You)' : ''}`
  }))

  const activePlayerIndex = Object.keys(gameState.player_statuses).indexOf(gameState.current_turn)
  const activePlayerObj = {
    id: (activePlayerIndex >= 0 ? activePlayerIndex : 0) as 0 | 1 | 2 | 3,
    name: `Player ${gameState.current_turn.slice(0, 4)}${gameState.current_turn === playerId ? ' (You)' : ''}`
  }

  // Map backend string statuses back to player IDs (0-3 index) for rendering
  const mappedPositions: Record<number, number> = {}
  Object.keys(gameState.player_statuses).forEach((pid, idx) => {
    mappedPositions[idx] = gameState.player_statuses[pid].position
  })

  // Format predictions for turn display
  const predictions: BoardPrediction[] = []
  if (currentPos > 0 && isMyTurn) {
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

  const displayPositions: Record<number, number> = { ...mappedPositions }
  if (visualState.type === 'stepping') {
    const idx = Object.keys(gameState.player_statuses).indexOf(visualState.playerId)
    if (idx >= 0) displayPositions[idx] = visualState.pos
  } else if (visualState.type === 'sliding') {
    const idx = Object.keys(gameState.player_statuses).indexOf(visualState.playerId)
    if (idx >= 0) displayPositions[idx] = 0
  }



  return (
    <div className="w-screen h-screen overflow-hidden m-0 p-0 bg-secondary-900 flex flex-row">
      {/* Lobby Error Banner */}
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1001] p-3 text-xs bg-primary-950 border border-primary-800 text-primary-400 rounded-lg font-bold shadow-md flex items-center gap-1.5">
          <AlertTriangle size={12} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Left main body: Board Container ── */}
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
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

        {/* Board background image */}
        <BoardBackground
          src="/bg.avif"
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
          onRectChange={setGridRect}
        />

        {/* Grid overlay */}
        {gridRect && (
          <BoardGrid
            rect={gridRect}
            positions={displayPositions}
            players={formatPlayers}
            predictions={predictions}
          />
        )}

        {/* Sliding token animations */}
        {visualState.type === 'sliding' && gridRect && (
          <SlidingToken
            playerId={Object.keys(gameState.player_statuses).indexOf(visualState.playerId) as 0|1|2|3}
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
          <PlayerPanel players={formatPlayers} currentPlayerId={activePlayerObj.id} />
          
          {!winner && (
            <DiceRoller
              currentPlayer={activePlayerObj}
              value={diceValue}
              rolling={diceRolling}
              onRoll={handleRoll}
              disabled={busy || !isMyTurn}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          {!winner && isMyTurn && (
            <PredictionPanel predictions={predictions} activePlayerId={activePlayerObj.id} />
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

export default function OnlinePlayPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-screen items-center justify-center bg-secondary-900 font-sans text-secondary-400 text-xs italic">Loading...</div>}>
      <OnlinePlayContent />
    </Suspense>
  )
}
