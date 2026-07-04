'use client'

import React from 'react'
import { soundManager } from '@/app/_utils/sound'

export interface GamingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'lg' | 'xl'
  theme?: 'golden' | 'classic' | 'primary'
  children: React.ReactNode
}

export default function GamingButton({
  size = 'lg',
  theme = 'primary',
  children,
  className = '',
  disabled,
  onClick,
  ...props
}: GamingButtonProps) {
  // Size-specific styles
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-[0.65rem] tracking-wider rounded-lg',
    lg: 'px-6 py-3 text-[0.75rem] tracking-widest rounded-xl',
    xl: 'px-8 py-4 text-[0.85rem] tracking-widest rounded-2xl',
  }[size]

  // Theme-specific styles
  const themeStyles = {
    primary:
      'bg-gradient-to-b from-primary-500 to-primary-600 border border-primary-400/30 border-b-[4px] border-b-primary-800 text-white font-black hover:from-primary-450 hover:to-primary-550 active:translate-y-[3px] active:border-b-[1px] hover:shadow-[0_0_12px_rgba(225,84,59,0.25)]',
    golden:
      'bg-gradient-to-b from-[#FFD700] to-[#E5A800] border border-[#FFF176]/30 border-b-[4px] border-b-[#7A6000] text-secondary-900 font-black hover:from-[#FFF176] hover:to-[#FFD700] active:translate-y-[3px] active:border-b-[1px] hover:shadow-[0_0_15px_rgba(255,215,0,0.35)]',
    classic:
      'bg-gradient-to-b from-secondary-750 to-secondary-850 border border-secondary-650/40 border-b-[4px] border-b-secondary-950 text-secondary-100 font-black hover:from-secondary-700 hover:to-secondary-800 active:translate-y-[3px] active:border-b-[1px] hover:shadow-[0_0_10px_rgba(120,113,108,0.15)]',
  }[theme]

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundManager.play('click')
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        uppercase font-sans select-none
        transition-[background,color,border-color,box-shadow,text-shadow] duration-150 ease-in-out
        ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${sizeStyles}
        ${themeStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
