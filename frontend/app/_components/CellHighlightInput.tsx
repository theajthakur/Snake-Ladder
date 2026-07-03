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
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-secondary-900 border border-secondary-700 rounded-xl p-2 px-3 shadow-sm">
      <label
        htmlFor="cell-highlight"
        className="text-secondary-300 text-xs font-semibold"
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
        className="w-16 px-2 py-1 rounded-lg border border-secondary-700 bg-secondary-800 text-secondary-100 text-sm text-center outline-none focus:border-primary-500 transition-colors"
      />
    </div>
  )
}
