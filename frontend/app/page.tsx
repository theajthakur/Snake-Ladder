'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PlayerToken from '@/app/_components/PlayerToken'
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
            <div className="text-center mt-6">
              <div className="text-5xl mb-4">🐍🎲</div>
              <h1 className="text-2xl font-black tracking-tight text-secondary-100">
                Snake &amp; Ladder
              </h1>
              <p className="text-xs text-secondary-400 mt-2.5 leading-relaxed max-w-xs mx-auto">
                Roll the dice, avoid the snakes, and climb to the top. Play local offline matches or connect online with other players.
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="w-full py-4 mt-8 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold tracking-wider rounded-xl cursor-pointer transition-colors border-0"
            >
              Get Started
            </button>
          </div>
        )}

        {/* ── STEP 1: Mode Selection ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center mt-6">
              <div className="text-4xl mb-3">🎮</div>
              <h1 className="text-xl font-black tracking-tight text-secondary-100">
                Select Game Mode
              </h1>
              <p className="text-xs text-secondary-400 mt-1.5">
                Choose how you want to play
              </p>
            </div>
            
            <div className="flex flex-col gap-3 my-auto">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-secondary-900 border border-secondary-700 hover:border-secondary-600 rounded-xl cursor-pointer text-left px-5 flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="block text-xs font-bold text-secondary-200">Local Offline</span>
                  <span className="text-[0.65rem] text-secondary-400">Play locally with friends on this screen</span>
                </div>
                <span className="text-xs text-secondary-500 group-hover:text-secondary-300">▶</span>
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="w-full py-3.5 bg-secondary-900 border border-secondary-700 hover:border-secondary-600 rounded-xl cursor-pointer text-left px-5 flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="block text-xs font-bold text-secondary-200">Online Multiplayer</span>
                  <span className="text-[0.65rem] text-secondary-400">Connect and host/join server rooms</span>
                </div>
                <span className="text-xs text-secondary-500 group-hover:text-secondary-300">▶</span>
              </button>
            </div>

            <button
              onClick={() => setStep(0)}
              className="w-full py-3 text-xs font-semibold text-secondary-400 hover:text-secondary-200 bg-transparent border-0 cursor-pointer"
            >
              Back
            </button>
          </div>
        )}

        {/* ── STEP 2: Offline Configuration ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-center mb-6">
                <h1 className="text-lg font-black text-secondary-100">Offline Setup</h1>
                <p className="text-[0.7rem] text-secondary-400">Choose player count and names</p>
              </div>

              {/* Player Count */}
              <div className="mb-5">
                <div className="flex gap-2.5">
                  {COUNT_OPTIONS.map((n) => {
                    const isSelected = n === selectedCount
                    const accent = PLAYERS[n - 1].color
                    return (
                      <button
                        key={n}
                        onClick={() => setSelectedCount(n)}
                        style={{
                          borderColor: isSelected ? accent : undefined,
                          backgroundColor: isSelected ? `${accent}18` : undefined,
                          color: isSelected ? accent : undefined,
                        }}
                        className={`flex-1 py-2 px-1 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'border-2 shadow-sm'
                            : 'border-secondary-700 bg-secondary-900/50 text-secondary-400 hover:border-secondary-600'
                        }`}
                      >
                        <PlayerToken playerId={(n - 1) as 0 | 1 | 2 | 3} size={24} />
                        <span className="text-[0.65rem] font-bold">{n} P</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Names */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[0.6rem] font-bold tracking-wider uppercase text-secondary-500">
                    Names
                  </label>
                  <button
                    onClick={handleSkipAll}
                    className="bg-transparent border border-secondary-700 hover:border-secondary-600 rounded px-2 py-0.5 text-secondary-400 hover:text-secondary-200 text-[0.62rem] cursor-pointer"
                  >
                    Skip All
                  </button>
                </div>
                <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto">
                  {Array.from({ length: selectedCount }, (_, i) => {
                    const config = PLAYERS[i]
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 bg-secondary-900/40 border border-secondary-700 focus-within:border-secondary-600 rounded-xl px-3 py-1.5 transition-colors"
                      >
                        <PlayerToken playerId={i as 0 | 1 | 2 | 3} size={22} />
                        <input
                          type="text"
                          maxLength={20}
                          value={names[i]}
                          placeholder={config.name}
                          onChange={(e) => setName(i, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLaunchOffline()}
                          style={{ caretColor: config.color }}
                          className="flex-1 bg-transparent border-0 outline-none text-white text-xs font-semibold"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 text-xs font-bold bg-secondary-750 hover:bg-secondary-700 text-secondary-300 rounded-xl cursor-pointer border-0"
              >
                Back
              </button>
              <button
                onClick={handleLaunchOffline}
                className="flex-1 py-3 text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-xl cursor-pointer border-0"
              >
                Launch Game
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Online Choice ── */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-center mt-6">
              <div className="text-4xl mb-3">🌐</div>
              <h1 className="text-xl font-black tracking-tight text-secondary-100">
                Online Multiplayer
              </h1>
              <p className="text-xs text-secondary-400 mt-1.5">
                Host a new session or join an invite code
              </p>
            </div>

            <div className="flex flex-col gap-3 my-auto">
              <button
                onClick={() => setStep(4)}
                className="w-full py-3.5 bg-secondary-900 border border-secondary-700 hover:border-secondary-600 rounded-xl cursor-pointer text-left px-5 flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="block text-xs font-bold text-secondary-200">Create Room</span>
                  <span className="text-[0.65rem] text-secondary-400">Initialize a new lobby session</span>
                </div>
                <span className="text-xs text-secondary-500 group-hover:text-secondary-300">▶</span>
              </button>

              <button
                onClick={() => setStep(5)}
                className="w-full py-3.5 bg-secondary-900 border border-secondary-700 hover:border-secondary-600 rounded-xl cursor-pointer text-left px-5 flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="block text-xs font-bold text-secondary-200">Join Room</span>
                  <span className="text-[0.65rem] text-secondary-400">Connect to an invite lobby</span>
                </div>
                <span className="text-xs text-secondary-500 group-hover:text-secondary-300">▶</span>
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3 text-xs font-semibold text-secondary-400 hover:text-secondary-200 bg-transparent border-0 cursor-pointer"
            >
              Back
            </button>
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
                <div className="mb-4 p-2.5 text-[0.7rem] bg-primary-950/20 border border-primary-800/40 text-primary-400 rounded-lg font-bold">
                  ⚠️ {errorMsg}
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

            <div className="flex gap-2 mt-4">
              <button
                disabled={loading}
                onClick={() => { setErrorMsg(null); setStep(3) }}
                className="flex-1 py-3 text-xs font-bold bg-secondary-750 hover:bg-secondary-700 text-secondary-300 rounded-xl cursor-pointer border-0 disabled:opacity-50"
              >
                Back
              </button>
              <button
                disabled={loading}
                onClick={handleCreateRoom}
                className="flex-1 py-3 text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-xl cursor-pointer border-0 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create & Join'}
              </button>
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
                <div className="mb-4 p-2.5 text-[0.7rem] bg-primary-950/20 border border-primary-800/40 text-primary-400 rounded-lg font-bold">
                  ⚠️ {errorMsg}
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

            <div className="flex gap-2 mt-4">
              <button
                disabled={loading}
                onClick={() => { setErrorMsg(null); setStep(3) }}
                className="flex-1 py-3 text-xs font-bold bg-secondary-750 hover:bg-secondary-700 text-secondary-300 rounded-xl cursor-pointer border-0 disabled:opacity-50"
              >
                Back
              </button>
              <button
                disabled={loading}
                onClick={handleJoinRoom}
                className="flex-1 py-3 text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-xl cursor-pointer border-0 disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Room'}
              </button>
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

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 text-xs font-bold bg-secondary-750 hover:bg-secondary-700 text-secondary-300 rounded-xl cursor-pointer border-0"
              >
                Leave
              </button>
              <button
                onClick={refreshLobby}
                className="flex-1 py-3 text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-xl cursor-pointer border-0 flex items-center justify-center gap-2"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}