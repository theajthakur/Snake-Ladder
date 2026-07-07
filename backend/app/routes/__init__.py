import asyncio
import time
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
    GameDetailResponse,
    GameModel,
    OpenRoomInfo
)

api_router = APIRouter()

async def cleanup_inactive_games():
    while True:
        try:
            await asyncio.sleep(30) # run check every 30 seconds
            now = time.time()
            inactive_ids = []
            for g_id, game in list(games.items()):
                # Check if last interaction was more than 5 minutes (300 seconds) ago
                if now - game.last_interaction > 300:
                    inactive_ids.append(g_id)
            
            for g_id in inactive_ids:
                if g_id in games:
                    del games[g_id]
                    print(f"[CLEANUP] Automatically deleted inactive game session {g_id} (no activity for 5 minutes)")
        except Exception as e:
            print(f"[CLEANUP ERROR] Failed cleaning inactive games: {e}")

@api_router.on_event("startup")
async def startup_event():
    asyncio.create_task(cleanup_inactive_games())

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
        game = join_game(request.game_id, request.name)
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
    summary="Get system health check status",
    description="Fetches metrics about memory usage, active game instances, and players.",
    response_description="Returns a health report with system metrics.",
    tags=["System"]
)
def status_app():
    import os
    try:
        import psutil
        process = psutil.Process(os.getpid())
        mem_mb = round(process.memory_info().rss / (1024 * 1024), 2)
    except Exception:
        mem_mb = 0.0

    total_games = len(games)
    active_games = 0
    completed_games = 0
    total_players = 0

    for game in games.values():
        total_players += len(game.player_statuses)
        if game.winner is not None:
            completed_games += 1
        elif game.game_started:
            active_games += 1

    return {
        "status": "healthy",
        "total_games": total_games,
        "active_games": active_games,
        "completed_games": completed_games,
        "total_players": total_players,
        "memory_usage_mb": mem_mb
    }


@api_router.get(
    "/game-state",
    response_model=GameModel,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Game ID not found."
        }
    },
    summary="Get game state for a session",
    description="Returns the full current state of a specific game session.",
    tags=["Game Management"]
)
def game_state_endpoint(game_id: str):
    game = games.get(game_id)
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found"
        )
    return game


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
            "name": game.player_statuses[pid].name,
            "id": pid
        })
        
    return {
        "game_id": game.game_id,
        "players": players_list,
        "game_size": game.player_size
    }

@api_router.get(
    "/game/open-rooms",
    response_model=list[OpenRoomInfo],
    summary="List open game rooms",
    description="Returns details for all active game lobbies that are not yet full.",
    tags=["Game Management"]
)
def get_open_rooms():
    open_rooms = []
    for g_id, game in games.items():
        joined_count = len(game.player_statuses)
        if joined_count < game.player_size:
            player_names = [player.name for player in game.player_statuses.values()]
            open_rooms.append({
                "gameId": game.game_id,
                "game_id": game.game_id,
                "players": player_names,
                "player_count": joined_count,
                "game_size": game.player_size
            })
    return open_rooms