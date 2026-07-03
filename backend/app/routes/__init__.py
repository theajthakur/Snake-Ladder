from fastapi import APIRouter, HTTPException, status
from uuid import uuid4
from .utils import throw_dice
from app.utils.game import start_game, join_game, games
from .schemas import (
    StartGameRequestBody,
    StartGameResponse,
    JoinGameRequestBody,
    JoinGameResponse,
    ThrowDiceRequestBody,
    ThrowDiceResponse,
    SystemStatusResponse,
    IndexResponse,
    ErrorResponse,
    GameDetailResponse
)

api_router = APIRouter()

@api_router.get(
    "/",
    response_model=IndexResponse,
    summary="Get root status",
    description="Returns a welcome message to confirm the backend routing is functional.",
    tags=["System"]
)
def index():
    return {"message": "Hello World"}


@api_router.post(
    "/start-game",
    response_model=StartGameResponse,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "Invalid initialization parameters (e.g. invalid player size)."
        }
    },
    summary="Start a new game lobby",
    description="Creates a new Game instance with the specified maximum player size.",
    response_description="Returns game details confirming it has been successfully started.",
    tags=["Game Management"]
)
def start_game_endpoint(request: StartGameRequestBody):
    try:
        game = start_game(request.player_size)

        return {
            "message": "Game started",
            "game_id": game.game_id,
            "player_size": game.player_size,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@api_router.post(
    "/join-game",
    response_model=JoinGameResponse,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "The requested game ID was not found."
        },
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "The game lobby is full or other validation error."
        }
    },
    summary="Join an existing game",
    description="Adds a new player token/session to the specified game lobby.",
    response_description="Returns the player status of the newly joined player.",
    tags=["Game Management"]
)
def join_game_endpoint(request: JoinGameRequestBody):
    try:
        game = join_game(request.game_id)
        return {
            "message": "Game joined",
            "game": game,
        }
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )


@api_router.post(
    "/throw-dice",
    response_model=ThrowDiceResponse,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "The specified game ID or player ID does not exist."
        },
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorResponse,
            "description": "Invalid turn or other dice rolling error."
        }
    },
    summary="Throw the dice",
    description="Rolls a dice for the designated player and advances their position on the game board.",
    response_description="Returns result of the roll, including new position and the next player's turn.",
    tags=["Gameplay"]
)
def throw_dice_endpoint(request: ThrowDiceRequestBody):
    try:
        game = throw_dice(request.game_id, request.player_id)
        return {
            "message": "Dice thrown",
            "game": game
        }
    except ValueError as e:
        error_msg = str(e)
        if "invalid game_id" in error_msg.lower() or "invalid player_id" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )


@api_router.get(
    "/test",
    response_model=SystemStatusResponse,
    summary="Get all game sessions status",
    description="Fetches a list of all active game lobbies and their complete in-memory states (useful for debugging).",
    response_description="Returns a dictionary mapping game IDs to their respective Game states.",
    tags=["System"]
)
def status_app():
    return {
        "game": games
    }


@api_router.get(
    "/game-detail",
    response_model=GameDetailResponse,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Game ID not found."
        }
    },
    summary="Get game details for waiting lobby",
    description="Returns list of players joined, game size, and game ID.",
    tags=["Game Management"]
)
def game_detail_endpoint(game_id: str):
    game = games.get(game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    
    players_list = []
    for idx, pid in enumerate(game.player_statuses.keys()):
        players_list.append({
            "name": f"Player {idx + 1}",
            "id": str(idx + 1)
        })
        
    return {
        "game_id": game.game_id,
        "players": players_list,
        "game_size": game.player_size
    }