import api from './api';

export interface PlayerStatus {
  player_id: string;
  name: string;
  position: number;
  turn_count: number;
  is_winner: boolean;
  is_activated: boolean;
}
// ...
export interface GameState {
  game_id: string;
  player_statuses: Record<string, PlayerStatus>;
  current_turn: string;
  player_size: number;
  game_started: boolean;
  winner: string | null;
  last_roll_value: number;
  last_roll_player: string;
}

export interface StartGameResponse {
  message: string;
  game_id: string;
  player_size: number;
}

export interface JoinGameResponse {
  message: string;
  game: PlayerStatus;
}

export interface ThrowDiceResult {
  value: number;
  position: number;
  turn: string;
}

export interface ThrowDiceResponse {
  message: string;
  game: ThrowDiceResult;
}

export interface SystemStatusResponse {
  status: string;
  total_games: number;
  active_games: number;
  completed_games: number;
  total_players: number;
  memory_usage_mb: number;
}

/**
 * Start a new game lobby
 * @param playerSize Number of players (1 to 4)
 * @param isPublic Whether the lobby should be publicly listable
 */
export async function startGame(playerSize: number, isPublic: boolean = true): Promise<StartGameResponse> {
  const response = await api.post<StartGameResponse>('/start-game', {
    player_size: playerSize,
    is_public: isPublic,
  });
  return response.data;
}

/**
 * Join an existing game lobby
 * @param gameId The UUID of the game
 * @param name The nickname of the player joining
 */
export async function joinGame(gameId: string, name: string): Promise<JoinGameResponse> {
  const response = await api.post<JoinGameResponse>('/join-game', {
    game_id: gameId,
    name: name,
  });
  return response.data;
}

/**
 * Throw dice for a player in a game
 * @param gameId The UUID of the game
 * @param playerId The UUID of the player taking the turn
 */
export async function throwDice(gameId: string, playerId: string): Promise<ThrowDiceResponse> {
  const response = await api.post<ThrowDiceResponse>('/throw-dice', {
    game_id: gameId,
    player_id: playerId,
  });
  return response.data;
}

/**
 * Retrieve system health check metrics status
 */
export async function getSystemStatus(): Promise<SystemStatusResponse> {
  const response = await api.get<SystemStatusResponse>('/test');
  return response.data;
}

/**
 * Fetch the full current state of a specific game session
 * @param gameId The UUID of the game
 */
export async function getGameState(gameId: string): Promise<GameState> {
  const response = await api.get<GameState>('/game-state', {
    params: { game_id: gameId },
  });
  return response.data;
}

export interface GamePlayerInfo {
  name: string;
  id: string;
}

export interface GameDetailResponse {
  game_id: string;
  players: GamePlayerInfo[];
  game_size: number;
}

/**
 * Fetch game details for the waiting lobby
 * @param gameId The UUID of the game
 */
export async function getGameDetail(gameId: string): Promise<GameDetailResponse> {
  const response = await api.get<GameDetailResponse>('/game-detail', {
    params: { game_id: gameId },
  });
  return response.data;
}

export interface OpenRoomInfo {
  gameId: string;
  game_id: string;
  players: string[];
  player_count: number;
  game_size: number;
}

/**
 * Fetch all open game rooms that are not full
 */
export async function getOpenRooms(): Promise<OpenRoomInfo[]> {
  const response = await api.get<OpenRoomInfo[]>('/game/open-rooms');
  return response.data;
}
