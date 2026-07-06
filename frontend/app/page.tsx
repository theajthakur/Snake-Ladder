'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

const GAMING_NAMES = [
  'AlphaLobo', 'BetaSnake', 'PixelMax', 'NeoClimber',
  'ApexRoller', 'CyberFang', 'DoomLadder', 'HyperStep',
  'OmegaRider', 'SonicCube', 'Toxico', 'SkyHigh',
  'NovaRacer', 'DeltaDash', 'RogueDie', 'VoltGrip'
]

export default function LandingPage() {
  const router = useRouter()

  // Wizard state: 0=Welcome, 1=Mode, 2=OfflineConfig, 3=OnlineChoice, 4=CreateRoom, 5=JoinRoom, 6=WaitingRoom
  const [step, setStep] = useState<number>(0)

  // FAQ Accordion State for SEO Section
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }
  
  // Offline State
  const [selectedCount, setSelectedCount] = useState<number>(2)
  const [names, setNames] = useState<string[]>(['', '', '', ''])

  // Online Config State
  const [onlineName, setOnlineName] = useState<string>(() => {
    const randomIdx = Math.floor(Math.random() * GAMING_NAMES.length);
    return GAMING_NAMES[randomIdx];
  })
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
    if (!onlineName.trim()) {
      setErrorMsg('Please enter your nickname.')
      return
    }
    setErrorMsg(null)
    setLoading(true)
    try {
      const roomRes = await startGame(onlineSize)
      const gId = roomRes.game_id
      const pSize = roomRes.player_size

      // Join game after creating
      const joinRes = await joinGame(gId, onlineName.trim())
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
    if (!onlineName.trim()) {
      setErrorMsg('Please enter your nickname.')
      return
    }
    if (!joinRoomId.trim()) {
      setErrorMsg('Please enter a Room Invite Code.')
      return
    }
    setErrorMsg(null)
    setLoading(true)
    try {
      const joinRes = await joinGame(joinRoomId.trim(), onlineName.trim())
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
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-secondary-900 py-8 px-4 font-sans text-secondary-100 overflow-x-hidden">
      {/* ── Main Interactive Section ── */}
      <main className="flex-1 flex items-center justify-center w-full max-w-md py-6">
        <div className="relative z-10 w-full bg-secondary-800 border border-secondary-700 rounded-2xl p-8 shadow-sm min-h-[480px] flex flex-col justify-between">
        
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
    </main>

    {/* ── SEO Rich Content Section ── */}
    <section className="w-full max-w-4xl mt-16 pt-12 border-t border-secondary-800/80 font-inter text-secondary-300">
      
      {/* Row 1: Intro Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-bold font-sans text-primary-500 tracking-wide uppercase mb-3">
            Play Snake &amp; Ladder Online
          </h2>
          <p className="text-sm leading-relaxed text-secondary-400">
            Welcome to the ultimate web version of the classic <strong className="text-secondary-100">snake and ladder</strong> board game! 
            Whether you are looking to kill time with <strong className="text-secondary-100">free online games</strong> or connect with family 
            in a competitive <strong className="text-secondary-100">two-player online game</strong>, this platform brings the traditional 
            dice game right to your browser. Climb high, avoid the slithering snakes, and compete to reach cell 100 first!
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold font-sans text-primary-500 tracking-wide uppercase mb-3">
            Real-Time Multiplayer Browser Games
          </h2>
          <p className="text-sm leading-relaxed text-secondary-400">
            Forget complicated setups. As one of the most engaging <strong className="text-secondary-100">multiplayer browser games</strong>, 
            our app lets you <strong className="text-secondary-100">play with friends</strong> instantly. Host a private room, 
            share your unique invite code, and enjoy a <strong className="text-secondary-100">real-time multiplayer game</strong>. 
            Our server-authoritative system ensures fair roll generation and fully validated player turn transitions.
          </p>
        </div>
      </div>

      {/* Row 2: Features Grid */}
      <div className="bg-secondary-850/50 border border-secondary-800 rounded-2xl p-6 md:p-8 mb-12 shadow-sm">
        <h3 className="text-lg font-black font-sans text-secondary-100 tracking-wide uppercase mb-6 text-center">
          Exciting Game Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 bg-secondary-900/60 border border-secondary-800 rounded-xl hover:border-secondary-750 transition-colors">
            <h4 className="text-sm font-bold text-secondary-100 uppercase mb-2 font-sans">🎲 Classic Dice Games</h4>
            <p className="text-xs text-secondary-400 leading-relaxed">
              Enjoy authentic random physics-based dice rolls fully generated and synchronized by our backend server API.
            </p>
          </div>
          <div className="p-4 bg-secondary-900/60 border border-secondary-800 rounded-xl hover:border-secondary-750 transition-colors">
            <h4 className="text-sm font-bold text-secondary-100 uppercase mb-2 font-sans">👥 Play With Friends</h4>
            <p className="text-xs text-secondary-400 leading-relaxed">
              Host online rooms for up to 4 players and send instant invite codes for fast matching across devices.
            </p>
          </div>
          <div className="p-4 bg-secondary-900/60 border border-secondary-800 rounded-xl hover:border-secondary-750 transition-colors">
            <h4 className="text-sm font-bold text-secondary-100 uppercase mb-2 font-sans">⚡ Real-time Play</h4>
            <p className="text-xs text-secondary-400 leading-relaxed">
              Watch token movements step-by-cell and slide down snakes or climb ladders with seamless CSS animations.
            </p>
          </div>
          <div className="p-4 bg-secondary-900/60 border border-secondary-800 rounded-xl hover:border-secondary-750 transition-colors">
            <h4 className="text-sm font-bold text-secondary-100 uppercase mb-2 font-sans">🔮 Hover Predictions</h4>
            <p className="text-xs text-secondary-400 leading-relaxed">
              Strategize your turns by previewing where potential dice rolls (2-6) will land your token on the board grid.
            </p>
          </div>
          <div className="p-4 bg-secondary-900/60 border border-secondary-800 rounded-xl hover:border-secondary-750 transition-colors">
            <h4 className="text-sm font-bold text-secondary-100 uppercase mb-2 font-sans">🔊 Immersive Sound</h4>
            <p className="text-xs text-secondary-400 leading-relaxed">
              Toggle spatial audio sound effects for board steps, climbing ladders, snake bites, and wins.
            </p>
          </div>
          <div className="p-4 bg-secondary-900/60 border border-secondary-800 rounded-xl hover:border-secondary-750 transition-colors">
            <h4 className="text-sm font-bold text-secondary-100 uppercase mb-2 font-sans">💻 Offline Mode</h4>
            <p className="text-xs text-secondary-400 leading-relaxed">
              No internet connection? Play a local pass-and-play match on a single screen with friends and family.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
        <div className="order-2 md:order-1">
          <h3 className="text-lg font-bold font-sans text-secondary-100 uppercase mb-4 tracking-wide">
            Official Snake and Ladder Rules
          </h3>
          <ol className="list-decimal list-inside text-sm text-secondary-400 space-y-3 leading-relaxed">
            <li>
              <strong className="text-secondary-200">Start of Game:</strong> All players begin off-board at position 0. You must roll a <strong className="text-primary-400">6</strong> to enter the board on cell 1.
            </li>
            <li>
              <strong className="text-secondary-200">Ladders:</strong> Landing on the bottom of a ladder automatically climbs you up to the designated target cell.
            </li>
            <li>
              <strong className="text-secondary-200">Snakes:</strong> Landing on a snake's head forces your token to slide down to the tip of its tail.
            </li>
            <li>
              <strong className="text-secondary-200">Winning:</strong> To win, you must reach cell 100 with an <strong className="text-primary-400">exact dice roll</strong>. If your roll exceeds the remaining distance, your token remains in place.
            </li>
          </ol>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <img
            src="/MAIN_LOGO.png"
            alt="Snake and Ladder Game Board Mockup Illustration"
            className="w-full max-w-sm rounded-2xl border border-secondary-800 shadow-lg select-none"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Row 4: Accordion FAQ Section */}
      <div className="border-t border-secondary-800/80 pt-8 mb-16">
        <h3 className="text-lg font-black font-sans text-secondary-100 tracking-wide uppercase mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3 max-w-3xl mx-auto">
          {[
            {
              q: "Is this online multiplayer board game free to play?",
              a: "Yes! Our Snake & Ladder board game is entirely free to play. You can play both local offline pass-and-play sessions and real-time online multiplayer games without paying anything or downloading any additional client software."
            },
            {
              q: "How do I play with friends in online multiplayer rooms?",
              a: "Simply select 'Online Multiplayer' mode, enter your preferred nickname, and select 'Create Room'. You will receive a unique lobby invite code. Share this code with your friends so they can input it in the 'Join Room' screen to connect to your lobby instantly."
            },
            {
              q: "What are hover predictions?",
              a: "The prediction system is a strategic tool designed to help you plan your moves. When it is your turn, hovering over the board highlights the outcome cells for all prospective dice roll values (2 to 6). It will highlight ladder climbs in green and snake traps in red."
            },
            {
              q: "What devices are supported?",
              a: "Since the game is built using Next.js and fully optimized for web browsers, you can play it on any modern desktop, laptop, tablet, or mobile phone device."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-secondary-850 border border-secondary-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-5 py-4 font-sans font-bold text-sm text-secondary-200 hover:text-secondary-100 flex justify-between items-center transition-colors cursor-pointer border-0 bg-transparent outline-none"
              >
                <span>{item.q}</span>
                <span className="text-primary-500 font-mono text-base ml-2">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-secondary-400 leading-relaxed border-t border-secondary-800/40 pt-2 bg-secondary-900/30">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Multi-Column SEO Link Grid Footer ── */}
      <footer className="w-full mt-16 pt-8 border-t border-secondary-800/80 font-sans text-xs text-secondary-400">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <h4 className="text-secondary-100 font-bold uppercase tracking-wider mb-3">Game Guides</h4>
            <ul className="space-y-2 p-0 m-0 list-none">
              <li><Link href="/how-to-play" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">How to Play</Link></li>
              <li><Link href="/rules" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Official Rules</Link></li>
              <li><Link href="/features" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Game Features</Link></li>
              <li><Link href="/multiplayer-guide" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Multiplayer Guide</Link></li>
              <li><Link href="/fair-play" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Fair Play (Dice Math)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-secondary-100 font-bold uppercase tracking-wider mb-3">Legal &amp; Policy</h4>
            <ul className="space-y-2 p-0 m-0 list-none">
              <li><Link href="/privacy" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Terms &amp; Conditions</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Disclaimer</Link></li>
              <li><Link href="/community-guidelines" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Community Rules</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-secondary-100 font-bold uppercase tracking-wider mb-3">Platform &amp; Dev</h4>
            <ul className="space-y-2 p-0 m-0 list-none">
              <li><Link href="/browser-compatibility" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Browser Support</Link></li>
              <li><Link href="/supported-devices" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Supported Devices</Link></li>
              <li><Link href="/accessibility" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Accessibility</Link></li>
              <li><Link href="/changelog" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Changelog</Link></li>
              <li><Link href="/roadmap" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-secondary-100 font-bold uppercase tracking-wider mb-3">Support &amp; Feedback</h4>
            <ul className="space-y-2 p-0 m-0 list-none">
              <li><Link href="/contact" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Help Center</Link></li>
              <li><Link href="/report-bug" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Report a Bug</Link></li>
              <li><Link href="/feedback" className="hover:text-primary-500 transition-colors no-underline text-secondary-400">Send Feedback</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Under-Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-secondary-800/40 text-[0.7rem] text-secondary-500 tracking-wide gap-4">
          <p>© {new Date().getFullYear()} Snake &amp; Ladder Online. All Rights Reserved. Play the ultimate free online multiplayer games.</p>
          <div className="flex gap-4">
            <Link href="/credits" className="hover:text-secondary-400 no-underline text-secondary-500">Credits</Link>
            <Link href="/licenses" className="hover:text-secondary-400 no-underline text-secondary-500">Licenses</Link>
            <Link href="/responsible-gaming" className="hover:text-secondary-400 no-underline text-secondary-500">Responsible Gaming</Link>
            <Link href="/safety-privacy" className="hover:text-secondary-400 no-underline text-secondary-500">Safety &amp; Privacy</Link>
          </div>
        </div>
      </footer>

    </section>
  </div>
)
}