from pydantic import BaseModel, Field
from typing import Dict, Optional

class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Detailed description of the error", examples=["Game not found"])

class StartGameRequestBody(BaseModel):
    player_size: int = Field(
        ...,
        description="Number of players for the game. Must be between 1 and 4.",
        ge=1,
        le=4,
        examples=[2]
    )

class StartGameResponse(BaseModel):
    message: str = Field(..., description="Success message confirming the game started", examples=["Game started"])
    game_id: str = Field(..., description="The unique identifier of the created game", examples=["550e8400-e29b-41d4-a716-446655440000"])
    player_size: int = Field(..., description="The player limit of this game session", examples=[2])

class JoinGameRequestBody(BaseModel):
    game_id: str = Field(..., description="The unique ID of the game to join", examples=["550e8400-e29b-41d4-a716-446655440000"])

class PlayerStatusModel(BaseModel):
    player_id: str = Field(..., description="Unique ID of the player", examples=["7a5d3f82-3d84-482a-a92c-63cf3a908a8f"])
    position: int = Field(..., description="Current square/position of the player on the board (0-100)", examples=[0])
    turn_count: int = Field(..., description="Total number of turns/rolls taken by this player", examples=[0])
    is_winner: bool = Field(..., description="Whether this player has won the game", examples=[False])
    is_activated: bool = Field(..., description="Whether the player has rolled a 6 to activate and start moving", examples=[False])

class JoinGameResponse(BaseModel):
    message: str = Field(..., description="Success message confirming player joined", examples=["Game joined"])
    game: PlayerStatusModel = Field(..., description="The status details of the joined player")

class ThrowDiceRequestBody(BaseModel):
    game_id: str = Field(..., description="The ID of the active game session", examples=["550e8400-e29b-41d4-a716-446655440000"])
    player_id: str = Field(..., description="The ID of the player rolling the dice", examples=["7a5d3f82-3d84-482a-a92c-63cf3a908a8f"])

class ThrowDiceResult(BaseModel):
    value: int = Field(..., description="The value of the rolled dice (1 to 6)", examples=[6])
    position: int = Field(..., description="The new position of the player after movement/snakes/ladders", examples=[1])
    turn: str = Field(..., description="The player ID whose turn it is next", examples=["7a5d3f82-3d84-482a-a92c-63cf3a908a8f"])

class ThrowDiceResponse(BaseModel):
    message: str = Field(..., description="Success message confirming dice roll", examples=["Dice thrown"])
    game: ThrowDiceResult = Field(..., description="The details of the dice throw and resultant state")

class GameModel(BaseModel):
    game_id: str = Field(..., description="Unique game session ID", examples=["550e8400-e29b-41d4-a716-446655440000"])
    player_statuses: Dict[str, PlayerStatusModel] = Field(..., description="Map of player ID to their status")
    current_turn: str = Field(..., description="The player ID who has the current turn", examples=["7a5d3f82-3d84-482a-a92c-63cf3a908a8f"])
    player_size: int = Field(..., description="Total players allowed in the game", examples=[2])
    game_started: bool = Field(..., description="Whether the game has started (lobby is full)", examples=[True])
    winner: Optional[str] = Field(None, description="The player ID of the winner, if game is finished", examples=["7a5d3f82-3d84-482a-a92c-63cf3a908a8f"])
    last_roll_value: int = Field(0, description="The value of the last dice roll")
    last_roll_player: str = Field("", description="The player ID who made the last roll")

class SystemStatusResponse(BaseModel):
    game: Dict[str, GameModel] = Field(..., description="Map of game IDs to their full state details")

class IndexResponse(BaseModel):
    message: str = Field(..., description="Welcome message", examples=["Hello World"])

class GamePlayerInfo(BaseModel):
    name: str = Field(..., description="The name of the player", examples=["Player 1"])
    id: str = Field(..., description="The index key from 1-4", examples=["1"])

class GameDetailResponse(BaseModel):
    game_id: str = Field(..., description="The unique session ID", examples=["550e8400-e29b-41d4-a716-446655440000"])
    players: list[GamePlayerInfo] = Field(..., description="List of players currently in this game")
    game_size: int = Field(..., description="The maximum player capacity", examples=[2])
