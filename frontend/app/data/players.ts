// ─────────────────────────────────────────────
//  Player Configuration
// ─────────────────────────────────────────────

export const MAX_PLAYERS = 4

export interface PlayerConfig {
  id: 0 | 1 | 2 | 3
  name: string
  /** Primary fill colour for the token */
  color: string
  /** Lighter highlight used for the inner gloss effect */
  highlight: string
  /** Darker shade used for the bottom shadow of the token */
  shadow: string
}

export const PLAYERS: PlayerConfig[] = [
  {
    id: 0,
    name: 'Player 1',
    color:     '#FF3B3B',   // vivid red
    highlight: '#FF8080',
    shadow:    '#8B0000',
  },
  {
    id: 1,
    name: 'Player 2',
    color:     '#3B8FFF',   // vivid blue
    highlight: '#80BFFF',
    shadow:    '#003580',
  },
  {
    id: 2,
    name: 'Player 3',
    color:     '#2ECC40',   // vivid green
    highlight: '#7DEFA0',
    shadow:    '#0A5C1A',
  },
  {
    id: 3,
    name: 'Player 4',
    color:     '#FFD700',   // vivid gold/yellow
    highlight: '#FFF176',
    shadow:    '#7A6000',
  },
]

/** O(1) lookup by player id */
export const playerById: Readonly<Record<number, PlayerConfig>> =
  Object.fromEntries(PLAYERS.map((p) => [p.id, p]))
