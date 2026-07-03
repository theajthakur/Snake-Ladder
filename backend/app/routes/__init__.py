from fastapi import APIRouter
from uuid import uuid4
from .utils import throw_dice
from pydantic import BaseModel
from app.utils.game import start_game, join_game, games

api_router=APIRouter()

@api_router.get("/")
def index():
    return {"message": "Hello World"}

class StartGameRequestBody(BaseModel):
    player_size: int


@api_router.post("/start-game")
def start_game_endpoint(request: StartGameRequestBody):
    try:
        game = start_game(request.player_size)

        return {
            "message": "Game started",
            "game_id": game.game_id,
            "player_size": game.player_size,
        }
    except ValueError as e:
        return {
            "message": str(e),
        }

class JoinGameRequestBody(BaseModel):
    game_id: str

@api_router.post("/join-game")
def join_game_endpoint(request: JoinGameRequestBody):
    try:
        game = join_game(request.game_id)
        return {
            "message": "Game joined",
            "game": game,
        }
    except ValueError as e:
        return {
            "message": str(e),
        }

class ThrowDiceRequestBody(BaseModel):
    game_id: str
    player_id: str

@api_router.post("/throw-dice")
def throw_dice_endpoint(request: ThrowDiceRequestBody):
    try:
        game = throw_dice(request.game_id, request.player_id)
        return {
            "message": "Dice thrown",
            "game" : game
        }
    except ValueError as e:
        return {
            "message": str(e),
        }

@api_router.get("/test")
def status():
    return {
        "game":games
    }