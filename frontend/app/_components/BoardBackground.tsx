'use client'

/**
 * BoardBackground.tsx
 *
 * Renders the full-viewport board image (objectFit: contain).
 * Fires onRectChange whenever the rendered image rect changes
 * (image load or container resize), so the parent can align
 * the grid overlay precisely.
 */
import React, { useEffect, useRef } from 'react'
import { getContainRect, type ContainRect } from '@/app/_utils/boardGeometry'

interface BoardBackgroundProps {
  src: string
  /** Called with the pixel rect of the rendered image inside the container */
  onRectChange: (rect: ContainRect) => void
  /** The ref of the parent container (used for ResizeObserver) */
  containerRef: React.RefObject<HTMLDivElement>
}

export default function BoardBackground({
  src,
  onRectChange,
  containerRef,
}: BoardBackgroundProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  const recalc = () => {
    const img  = imgRef.current
    const wrap = containerRef.current
    if (!img || !wrap || !img.naturalWidth) return

    onRectChange(
      getContainRect(
        wrap.clientWidth,
        wrap.clientHeight,
        img.naturalWidth,
        img.naturalHeight,
      )
    )
  }

  // Recalculate whenever the container is resized
  useEffect(() => {
    const wrap = containerRef.current
    if (!wrap) return
    const ro = new ResizeObserver(recalc)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <img
      ref={imgRef}
      src={src}
      alt="board background"
      onLoad={recalc}
      style={{
        position:        'absolute',
        inset:           0,
        width:           '100%',
        height:          '100%',
        objectFit:       'contain',
        objectPosition:  'center',
      }}
    />
  )
}
