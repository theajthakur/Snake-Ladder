'use client'

import React from 'react'
import PlayerToken from './PlayerToken'
import GamingButton from './GamingButton'
import { PLAYERS } from '@/app/data/players'

const COUNT_OPTIONS = [1, 2, 3, 4] as const

interface OfflineSetupProps {
  selectedCount: number
  setSelectedCount: (n: number) => void
  names: string[]
  setName: (idx: number, val: string) => void
  handleSkipAll: () => void
  handleLaunch: () => void
  onBack: () => void
}

export default function OfflineSetup({
  selectedCount,
  setSelectedCount,
  names,
  setName,
  handleSkipAll,
  handleLaunch,
  onBack,
}: OfflineSetupProps) {
  return (
    <div className="flex-1 flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <div className="text-center mb-6 select-none">
          <h1 className="text-xl font-black text-secondary-100 tracking-tight">Offline Setup</h1>
          <p className="text-[0.7rem] text-secondary-400 font-semibold mt-1">Choose player count and names</p>
        </div>

        {/* 3D Player Count Selector */}
        <div className="mb-5">
          <label className="text-[0.6rem] font-black tracking-widest uppercase text-secondary-500 block mb-2 select-none">
            Select Players
          </label>
          <div className="flex gap-2.5">
            {COUNT_OPTIONS.map((n) => {
              const isSelected = n === selectedCount
              const player = PLAYERS[n - 1]
              const accentColor = player.color
              const shadowColor = player.shadow

              return (
                <button
                  key={n}
                  onClick={() => setSelectedCount(n)}
                  style={{
                    borderColor: isSelected ? accentColor : undefined,
                    backgroundColor: isSelected ? `${accentColor}12` : undefined,
                    color: isSelected ? accentColor : undefined,
                    borderBottomColor: isSelected ? shadowColor : '#1c1917', // secondary-950
                    boxShadow: isSelected ? `0 0 10px ${accentColor}15` : undefined,
                  }}
                  className={`flex-1 py-3 px-1 rounded-xl border border-b-[4px] text-center font-black transition-all duration-150 flex flex-col items-center gap-1.5 cursor-pointer select-none active:translate-y-[3px] active:border-b-[1px] ${
                    isSelected
                      ? 'border-2 border-b-[4px]'
                      : 'border-secondary-700 bg-secondary-900/50 text-secondary-400 hover:border-secondary-600'
                  }`}
                >
                  <PlayerToken playerId={(n - 1) as 0 | 1 | 2 | 3} size={24} />
                  <span className="text-[0.65rem] font-black tracking-wide">{n} P</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3D Sunken Name Fields */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2 select-none">
            <label className="text-[0.6rem] font-black tracking-widest uppercase text-secondary-500">
              Names
            </label>
            <GamingButton
              onClick={handleSkipAll}
              theme="classic"
              size="sm"
              className="py-1 px-3 text-[0.55rem]"
            >
              Skip All
            </GamingButton>
          </div>

          <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto pr-1">
            {Array.from({ length: selectedCount }, (_, i) => {
              const config = PLAYERS[i]
              return (
                <div
                  key={i}
                  style={{
                    borderColor: config.color + '30',
                  }}
                  className="flex items-center gap-2.5 bg-secondary-950 border border-secondary-800 rounded-xl px-3.5 py-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_8px_rgba(255,255,255,0.02)] transition-all duration-200"
                >
                  <PlayerToken playerId={i as 0 | 1 | 2 | 3} size={20} />
                  <input
                    type="text"
                    maxLength={20}
                    value={names[i]}
                    placeholder={config.name}
                    onChange={(e) => setName(i, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
                    style={{ caretColor: config.color }}
                    className="flex-1 bg-transparent border-0 outline-none text-white text-xs font-bold font-sans placeholder-secondary-600"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 mt-4">
        <GamingButton
          onClick={onBack}
          theme="classic"
          size="lg"
          className="flex-1"
        >
          Back
        </GamingButton>
        <GamingButton
          onClick={handleLaunch}
          theme="primary"
          size="lg"
          className="flex-1"
        >
          Launch Game
        </GamingButton>
      </div>
    </div>
  )
}
