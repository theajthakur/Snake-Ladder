// ─────────────────────────────────────────────
//  Board Data — Snakes & Ladders
// ─────────────────────────────────────────────

/** A snake goes DOWN: head (higher number) → tail (lower number) */
export interface Snake {
  head: number   // cell where the snake starts (player lands here)
  tail: number   // cell where the player ends up (lower)
}

/** A ladder goes UP: bottom (lower number) → top (higher number) */
export interface Ladder {
  bottom: number  // cell where the ladder starts (player lands here)
  top: number     // cell where the player ends up (higher)
}

// ─────────────────────────────────────────────
//  Raw data arrays
// ─────────────────────────────────────────────

export const SNAKES: Snake[] = [
  { head: 27, tail: 5  },
  { head: 40, tail: 3  },
  { head: 43, tail: 18 },
  { head: 54, tail: 31 },
  { head: 66, tail: 45 },
  { head: 89, tail: 53 },
  { head: 95, tail: 77 },
  { head: 99, tail: 41 },
]

export const LADDERS: Ladder[] = [
  { bottom: 4,  top: 25 },
  { bottom: 13, top: 46 },
  { bottom: 42, top: 63 },
  { bottom: 50, top: 69 },
  { bottom: 62, top: 81 },
  { bottom: 74, top: 92 },
]

// ─────────────────────────────────────────────
//  Indexed lookup maps (O(1) access by cell)
// ─────────────────────────────────────────────

/**
 * snakeMap[cellNumber] = tail
 * If a player lands on a key cell, they slide down to the value cell.
 *
 * Example: snakeMap[27] === 5
 */
export const snakeMap: Readonly<Record<number, number>> = Object.fromEntries(
  SNAKES.map((s) => [s.head, s.tail])
)

/**
 * ladderMap[cellNumber] = top
 * If a player lands on a key cell, they climb up to the value cell.
 *
 * Example: ladderMap[4] === 25
 */
export const ladderMap: Readonly<Record<number, number>> = Object.fromEntries(
  LADDERS.map((l) => [l.bottom, l.top])
)

// ─────────────────────────────────────────────
//  Convenience helpers
// ─────────────────────────────────────────────

/** Returns the resolved cell after applying any snake or ladder. */
export function resolveCell(cell: number): number {
  if (snakeMap[cell] !== undefined) return snakeMap[cell]
  if (ladderMap[cell] !== undefined) return ladderMap[cell]
  return cell
}

/** Returns 'snake' | 'ladder' | null for a given cell. */
export function cellType(cell: number): 'snake' | 'ladder' | null {
  if (snakeMap[cell]  !== undefined) return 'snake'
  if (ladderMap[cell] !== undefined) return 'ladder'
  return null
}
