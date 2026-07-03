/**
 * gameStore.ts
 * Lightweight localStorage-backed game state.
 * No external dependencies — just plain JSON.
 */

export interface GamePlayer {
  id: 0 | 1 | 2 | 3
  name: string
}

export interface GameState {
  /** Active players for this session */
  players: GamePlayer[]
  /** Index into players[] whose turn it is */
  currentPlayerIndex: number
  /** playerId → current board cell (0 = not yet entered) */
  positions: Record<number, number>
}

const KEY = 'snl_game_state'

// ── Persistence ───────────────────────────────

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

export function clearGameState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

// ── Factory ───────────────────────────────────

/** Create a fresh game state for the given players (all start at cell 0). */
export function createNewGame(players: GamePlayer[]): GameState {
  const positions: Record<number, number> = {}
  players.forEach((p) => { positions[p.id] = 0 })
  return { players, currentPlayerIndex: 0, positions }
}

// ── Selectors ─────────────────────────────────

/** Returns the player whose turn it currently is. */
export function currentPlayer(state: GameState): GamePlayer {
  return state.players[state.currentPlayerIndex]
}

// ── Reducers ──────────────────────────────────

/** Advance to the next player's turn (immutable). */
export function nextTurn(state: GameState): GameState {
  return {
    ...state,
    currentPlayerIndex:
      (state.currentPlayerIndex + 1) % state.players.length,
  }
}

/** Move a player to a new cell (immutable). */
export function movePlayer(
  state: GameState,
  playerId: number,
  toCell: number,
): GameState {
  return {
    ...state,
    positions: { ...state.positions, [playerId]: toCell },
  }
}
