'use client'

import { useEffect } from 'react'

export default function CursorManager() {
  useEffect(() => {
    let timeoutId: number | undefined

    const handleMouseMove = () => {
      document.documentElement.classList.add('cursor-moving')
      
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      
      timeoutId = window.setTimeout(() => {
        document.documentElement.classList.remove('cursor-moving')
      }, 100) // 100ms threshold for cursor rest state
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  return null
}
