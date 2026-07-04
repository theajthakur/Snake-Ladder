from dataclasses import dataclass, field
from typing import Dict, Optional
from uuid import uuid4


@dataclass
class PlayerStatus:
    player_id: str
    position: int = 0
    turn_count: int = 0
    is_winner: bool = False
    is_activated: bool = False


@dataclass
class Game:
    game_id: str
    player_statuses: Dict[str,PlayerStatus] = field(default_factory=dict)
    current_turn: str = ""
    player_size: int = 2
    game_started:bool = False
    winner: Optional[str] = None
    last_roll_value: int = 0
    last_roll_player: str = ""


games: Dict[str, Game] = {}


def start_game(player_size: int) -> str:
    game_id = str(uuid4().hex[:4])
    while game_id in games:
        game_id = str(uuid4().hex[:5])
    
    size=player_size
    if(size<2): size=2
    if(size>4): size=4

    games[game_id] = Game(
        game_id=game_id,
        player_size=size
    )

    return games.get(game_id)


def join_game(game_id: str) -> PlayerStatus:
    game = games.get(game_id)

    if game is None:
        raise ValueError("Game not found")

    if len(game.player_statuses) >= game.player_size:
        raise ValueError("Game is full")

    player = PlayerStatus(player_id=str(uuid4()))
    game.player_statuses[player.player_id]=player

    # Set first player's turn
    if len(game.player_statuses) == 1:
        game.current_turn = player.player_id
    elif len(game.player_statuses)==game.player_size:
        game.game_started=True

    return game.player_statuses[player.player_id]