'use client'

import React, { useState, useEffect } from 'react'
import { soundManager } from '@/app/_utils/sound'

interface SoundToggleButtonProps {
  className?: string
}

export default function SoundToggleButton({ className }: SoundToggleButtonProps) {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    // Sync initial state on client-side mount
    setMuted(soundManager.isMuted())
  }, [])

  const handleToggle = () => {
    const nextMute = !muted
    soundManager.setMute(nextMute)
    setMuted(nextMute)
  }

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Unmute game sounds' : 'Mute game sounds'}
      className={className || "flex items-center justify-center bg-secondary-900 border border-secondary-700 hover:border-secondary-600 rounded-xl p-2.5 shadow-sm text-secondary-300 hover:text-secondary-100 cursor-pointer transition-all duration-200"}
    >
      {muted ? (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
        </svg>
      ) : (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
        </svg>
      )}
    </button>
  )
}
