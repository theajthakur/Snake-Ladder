'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PlayerToken from '@/app/_components/PlayerToken'
import GamingButton from '@/app/_components/GamingButton'
import GamingModeButton from '@/app/_components/GamingModeButton'
import OfflineSetup from '@/app/_components/OfflineSetup'
import { Gamepad2, Globe, AlertTriangle, RotateCw } from 'lucide-react'
import { PLAYERS } from '@/app/data/players'
import { createNewGame, saveGameState, type GamePlayer } from '@/app/_store/gameStore'
import {
  startGame,
  joinGame,
  getGameDetail,
  type GamePlayerInfo,
} from '@/lib/game'

const COUNT_OPTIONS = [1, 2, 3, 4] as const

export default function LandingPage() {
  const router = useRouter()

  // Wizard state: 0=Welcome, 1=Mode, 2=OfflineConfig, 3=OnlineChoice, 4=CreateRoom, 5=JoinRoom, 6=WaitingRoom
  const [step, setStep] = useState<number>(0)
  
  // Offline State
  const [selectedCount, setSelectedCount] = useState<number>(2)
  const [names, setNames] = useState<string[]>(['', '', '', ''])

  // Online Config State
  const [onlineName, setOnlineName] = useState<string>('')
  const [onlineSize, setOnlineSize] = useState<number>(2)
  const [joinRoomId, setJoinRoomId] = useState<string>('')

  // Waiting Room State
  const [waitingPlayers, setWaitingPlayers] = useState<GamePlayerInfo[]>([])
  const [waitingGameSize, setWaitingGameSize] = useState<number>(2)
  const [waitingGameId, setWaitingGameId] = useState<string>('')
  const [playerId, setPlayerId] = useState<string>('')

  // Status State
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // ── Offline logic ──────────────────────────────────────────────────────────
  const setName = (idx: number, val: string) =>
    setNames((prev) => Object.assign([...prev], { [idx]: val }))

  const handleSkipAll = () => setNames(['', '', '', ''])

  const handleLaunchOffline = () => {
    const players: GamePlayer[] = Array.from(
      { length: selectedCount },
      (_, i) => ({
        id: i as 0 | 1 | 2 | 3,
        name: names[i].trim() || PLAYERS[i].name,
      }),
    )
    saveGameState(createNewGame(players))
    router.push('/play/offline')
  }

  // ── Online API Create Room ──────────────────────────────────────────────────
  const handleCreateRoom = async () => {
    setErrorMsg(null)
    setLoading(true)
    try {
      const roomRes = await startGame(onlineSize)
      const gId = roomRes.game_id
      const pSize = roomRes.player_size

      // Join game after creating
      const joinRes = await joinGame(gId)
      const pId = joinRes.game.player_id

      // Store credentials in localStorage
      localStorage.setItem('gameId', gId)
      localStorage.setItem('curPlayerId', pId)
      localStorage.setItem('currentUserId', pId)
      localStorage.setItem('game_player_size', String(pSize))

      setWaitingGameId(gId)
      setPlayerId(pId)
      setWaitingGameSize(pSize)

      // Fetch initial lobby details
      const detail = await getGameDetail(gId)
      setWaitingPlayers(detail.players)

      setStep(6) // Transition to waiting room
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create online room.')
    } finally {
      setLoading(false)
    }
  }

  // ── Online API Join Room ────────────────────────────────────────────────────
  const handleJoinRoom = async () => {
    if (!joinRoomId.trim()) {
      setErrorMsg('Please enter a Room Invite Code.')
      return
    }
    setErrorMsg(null)
    setLoading(true)
    try {
      const joinRes = await joinGame(joinRoomId.trim())
      const pId = joinRes.game.player_id
      const gId = joinRoomId.trim()

      localStorage.setItem('gameId', gId)
      localStorage.setItem('curPlayerId', pId)
      localStorage.setItem('currentUserId', pId)

      setWaitingGameId(gId)
      setPlayerId(pId)

      // Fetch lobby details to get size
      const detail = await getGameDetail(gId)
      localStorage.setItem('game_player_size', String(detail.game_size))
      setWaitingGameSize(detail.game_size)
      setWaitingPlayers(detail.players)

      setStep(6) // Transition to waiting room
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to join online room.')
    } finally {
      setLoading(false)
    }
  }

  // ── Polling / Refresh Waiting Room details ──────────────────────────────────
  const refreshLobby = async () => {
    if (!waitingGameId) return
    try {
      const detail = await getGameDetail(waitingGameId)
      setWaitingPlayers(detail.players)
      setWaitingGameSize(detail.game_size)

      // If full, redirect to online game board
      if (detail.players.length === detail.game_size) {
        router.push(`/play/online?game_id=${waitingGameId}&player_id=${playerId}`)
      }
    } catch (err) {
      console.error('Failed to sync waiting lobby:', err)
    }
  }

  // Auto-poll Waiting Room lobby every 2.5 seconds when active
  useEffect(() => {
    if (step !== 6 || !waitingGameId) return
    const interval = setInterval(refreshLobby, 2500)
    return () => clearInterval(interval)
  }, [step, waitingGameId, playerId])

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-secondary-900 p-4 font-sans text-secondary-100">
      {/* ── Card Container ── */}
      <div className="relative z-10 w-full max-w-md bg-secondary-800 border border-secondary-700 rounded-2xl p-8 shadow-sm min-h-[480px] flex flex-col justify-between">
        
        {/* ── STEP 0: Welcome Screen ── */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center mt-6 flex flex-col items-center">
              <img
                src="/logo.png"
                alt="Snake & Ladder Logo"
                className="w-[100px] h-[100px] mb-4 object-contain rounded-2xl border border-secondary-700 shadow-md select-none pointer-events-none"
              />
              <h1 className="text-2xl font-black tracking-tight text-secondary-100">
                Snake &amp; Ladder
              </h1>
              <p className="text-xs text-secondary-400 mt-2.5 leading-relaxed max-w-xs mx-auto">
                Roll the dice, avoid the snakes, and climb to the top. Play local offline matches or connect online with other players.
              </p>
            </div>
            <GamingButton
              onClick={() => setStep(1)}
              size="lg"
              theme="golden"
              className="w-full mt-8"
            >
              Get Started
            </GamingButton>
          </div>
        )}

        {/* ── STEP 1: Mode Selection ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center mt-6 flex flex-col items-center">
              <Gamepad2 size={40} className="text-primary-500 mb-3" />
              <h1 className="text-xl font-black tracking-tight text-secondary-100">
                Select Game Mode
              </h1>
              <p className="text-xs text-secondary-400 mt-1.5">
                Choose how you want to play
              </p>
            </div>
            
            <div className="flex flex-col gap-3 my-auto">
              <GamingModeButton
                onClick={() => setStep(2)}
                title="Local Offline"
                description="Play locally with friends on this screen"
                theme="classic"
              />
              
              <GamingModeButton
                onClick={() => setStep(3)}
                title="Online Multiplayer"
                description="Connect and host/join server rooms"
                theme="classic"
              />
            </div>

            <GamingButton
              onClick={() => setStep(0)}
              theme="classic"
              size="sm"
              className="w-full mt-4"
            >
              Back
            </GamingButton>
          </div>
        )}

        {/* ── STEP 2: Offline Configuration ── */}
        {step === 2 && (
          <OfflineSetup
            selectedCount={selectedCount}
            setSelectedCount={setSelectedCount}
            names={names}
            setName={setName}
            handleSkipAll={handleSkipAll}
            handleLaunch={handleLaunchOffline}
            onBack={() => setStep(1)}
          />
        )}

        {/* ── STEP 3: Online Choice ── */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center mt-6 flex flex-col items-center">
              <Globe size={40} className="text-primary-500 mb-3" />
              <h1 className="text-xl font-black tracking-tight text-secondary-100">
                Online Multiplayer
              </h1>
              <p className="text-xs text-secondary-400 mt-1.5">
                Host a new session or join an invite code
              </p>
            </div>

            <div className="flex flex-col gap-3 my-auto">
              <GamingModeButton
                onClick={() => setStep(4)}
                title="Create Room"
                description="Initialize a new lobby session"
                theme="classic"
              />

              <GamingModeButton
                onClick={() => setStep(5)}
                title="Join Room"
                description="Connect to an invite lobby"
                theme="classic"
              />
            </div>

            <GamingButton
              onClick={() => setStep(1)}
              theme="classic"
              size="sm"
              className="w-full mt-4"
            >
              Back
            </GamingButton>
          </div>
        )}

        {/* ── STEP 4: Create Room Form ── */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-center mb-6">
                <h1 className="text-lg font-black text-secondary-100">Create Room</h1>
                <p className="text-[0.7rem] text-secondary-400">Configure team size and name</p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-2.5 text-[0.7rem] bg-primary-950/20 border border-primary-800/40 text-primary-400 rounded-lg font-bold flex items-center gap-1.5">
                  <AlertTriangle size={11} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Nickname */}
              <div className="mb-4">
                <label className="block mb-1.5 text-[0.6rem] font-bold uppercase text-secondary-500">
                  Your Nickname
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={onlineName}
                  onChange={(e) => setOnlineName(e.target.value)}
                  placeholder="Player 1"
                  className="w-full bg-secondary-900 border border-secondary-700 focus:border-secondary-600 rounded-xl px-3 py-2 text-xs font-semibold outline-none text-white"
                />
              </div>

              {/* Game Size */}
              <div className="mb-4">
                <label className="block mb-1.5 text-[0.6rem] font-bold uppercase text-secondary-500">
                  Room Size (Players limit)
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setOnlineSize(sz)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                        onlineSize === sz
                          ? 'border-primary-500 bg-primary-950/20 text-primary-400'
                          : 'border-secondary-700 bg-secondary-900/50 text-secondary-400 hover:border-secondary-600'
                      }`}
                    >
                      {sz} Players
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-4">
              <GamingButton
                disabled={loading}
                onClick={() => { setErrorMsg(null); setStep(3) }}
                theme="classic"
                size="lg"
                className="flex-1"
              >
                Back
              </GamingButton>
              <GamingButton
                disabled={loading}
                onClick={handleCreateRoom}
                theme="primary"
                size="lg"
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create & Join'}
              </GamingButton>
            </div>
          </div>
        )}

        {/* ── STEP 5: Join Room Form ── */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-center mb-6">
                <h1 className="text-lg font-black text-secondary-100">Join Room</h1>
                <p className="text-[0.7rem] text-secondary-400">Connect using invite details</p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-2.5 text-[0.7rem] bg-primary-950/20 border border-primary-800/40 text-primary-400 rounded-lg font-bold flex items-center gap-1.5">
                  <AlertTriangle size={11} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Nickname */}
              <div className="mb-4">
                <label className="block mb-1.5 text-[0.6rem] font-bold uppercase text-secondary-500">
                  Your Nickname
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={onlineName}
                  onChange={(e) => setOnlineName(e.target.value)}
                  placeholder="Player 2"
                  className="w-full bg-secondary-900 border border-secondary-700 focus:border-secondary-600 rounded-xl px-3 py-2 text-xs font-semibold outline-none text-white"
                />
              </div>

              {/* Room ID */}
              <div className="mb-4">
                <label className="block mb-1.5 text-[0.6rem] font-bold uppercase text-secondary-500">
                  Invite Code (Game ID)
                </label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Enter Session UUID"
                  className="w-full bg-secondary-900 border border-secondary-700 focus:border-secondary-600 rounded-xl px-3 py-2.5 text-xs font-mono outline-none text-white"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-4">
              <GamingButton
                disabled={loading}
                onClick={() => { setErrorMsg(null); setStep(3) }}
                theme="classic"
                size="lg"
                className="flex-1"
              >
                Back
              </GamingButton>
              <GamingButton
                disabled={loading}
                onClick={handleJoinRoom}
                theme="primary"
                size="lg"
                className="flex-1"
              >
                {loading ? 'Joining...' : 'Join Room'}
              </GamingButton>
            </div>
          </div>
        )}

        {/* ── STEP 6: Waiting Room Lobby ── */}
        {step === 6 && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-center mb-5">
                <h1 className="text-lg font-black text-secondary-100 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Lobby Waiting Room
                </h1>
                <p className="text-[0.7rem] text-secondary-400">Lobby syncing in progress...</p>
              </div>

              {/* Invite Code display */}
              <div className="bg-secondary-900 border border-secondary-700 rounded-xl p-3 mb-5 text-center flex flex-col items-center justify-center relative">
                <span className="text-[0.55rem] font-bold text-secondary-500 uppercase tracking-wider block mb-1">
                  Invite Code
                </span>
                <span className="text-xs font-mono font-bold text-primary-400 break-all select-all">
                  {waitingGameId}
                </span>
              </div>

              {/* Skeletons Slot Layout */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[0.6rem] font-bold uppercase text-secondary-500 block mb-0.5">
                  Lobby slots ({waitingPlayers.length} / {waitingGameSize})
                </label>
                {Array.from({ length: waitingGameSize }, (_, idx) => {
                  const player = waitingPlayers[idx]
                  if (player) {
                    return (
                      <div
                        key={idx}
                        className="bg-secondary-900/60 border border-secondary-750 rounded-xl px-4 py-2 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <PlayerToken playerId={idx as 0 | 1 | 2 | 3} size={20} />
                          <span className="text-xs font-bold text-secondary-200">
                            {player.name}
                          </span>
                        </div>
                        <span className="text-[0.62rem] text-emerald-500 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40">
                          Joined
                        </span>
                      </div>
                    )
                  } else {
                    return (
                      <div
                        key={idx}
                        className="animate-pulse bg-secondary-900/30 border border-secondary-800/40 h-[38px] rounded-xl flex items-center justify-between px-4 text-[0.65rem] text-secondary-500 font-medium"
                      >
                        <span>Waiting for player slot...</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-700" />
                      </div>
                    )
                  }
                })}
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <GamingButton
                onClick={() => setStep(3)}
                theme="classic"
                size="lg"
                className="flex-1"
              >
                Leave
              </GamingButton>
              <GamingButton
                onClick={refreshLobby}
                theme="primary"
                size="lg"
                className="flex-1 gap-2"
              >
                <RotateCw size={12} />
                <span>Refresh</span>
              </GamingButton>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}