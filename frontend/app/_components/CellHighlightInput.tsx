'use client'

/**
 * CellHighlightInput.tsx
 *
 * Fixed top-right pill input for highlighting a cell (1–100).
 * Calls onChange with the valid number, or null to clear.
 */
import React from 'react'

interface CellHighlightInputProps {
  onChange: (cell: number | null) => void
}

export default function CellHighlightInput({ onChange }: CellHighlightInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10)
    onChange(v >= 1 && v <= 100 ? v : null)
  }

  return (
    <div
      style={{
        position:       'fixed',
        top:            16,
        right:          16,
        zIndex:         999,
        display:        'flex',
        alignItems:     'center',
        gap:            8,
        background:     'rgba(0,0,0,0.70)',
        border:         '1px solid rgba(255,255,255,0.20)',
        borderRadius:   10,
        padding:        '8px 12px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <label
        htmlFor="cell-highlight"
        style={{
          color:      'rgba(255,255,255,0.70)',
          fontSize:   '0.75rem',
          fontWeight: 600,
        }}
      >
        Highlight cell
      </label>
      <input
        id="cell-highlight"
        type="number"
        min={1}
        max={100}
        placeholder="1–100"
        onChange={handleChange}
        style={{
          width:        64,
          padding:      '4px 8px',
          borderRadius: 6,
          border:       '1px solid rgba(255,255,255,0.25)',
          background:   'rgba(255,255,255,0.10)',
          color:        '#fff',
          fontSize:     '0.85rem',
          outline:      'none',
          textAlign:    'center',
        }}
      />
    </div>
  )
}
