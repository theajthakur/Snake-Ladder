'use client'

import React from 'react'
import GamingButton from './GamingButton'

interface GamingModeButtonProps {
  title: string
  description: string
  icon?: React.ReactNode
  onClick?: () => void
  theme?: 'golden' | 'classic' | 'primary'
  className?: string
}

export default function GamingModeButton({
  title,
  description,
  icon = '▶',
  onClick,
  theme = 'classic',
  className = '',
}: GamingModeButtonProps) {
  return (
    <GamingButton
      onClick={onClick}
      theme={theme}
      size="lg"
      className={`w-full justify-between items-center px-6 py-4 text-left ${className}`}
    >
      {/* Title and Description Group (Strict Left Alignment) */}
      <div className="flex flex-col gap-1 text-left font-sans tracking-wide">
        <span className="block text-xs font-black text-secondary-200 uppercase leading-none">
          {title}
        </span>
        <span className="block text-[0.6rem] text-secondary-400 font-semibold normal-case leading-snug">
          {description}
        </span>
      </div>
      
      {/* Icon (Strict Right Alignment) */}
      <div className="flex items-center justify-center text-xs font-bold text-secondary-500 select-none pl-4">
        {icon}
      </div>
    </GamingButton>
  )
}
