import random
from app.utils.game import games
from app.utils.store import SNAKES,LADDERS


def throw_dice(game_id, player_id, favour: bool = False):
    val=dice(favour)
    game=games.get(game_id)
    if not game:
        raise ValueError("Invalid game_id")
    player=game.player_statuses.get(player_id)
    if not player:
        raise ValueError("Invalid player_id")
    
    if game.current_turn!=player_id:
        raise ValueError("Invalid turn")

    if val==6 and not player.is_activated:
        player.is_activated = True
        player.turn_count += 1
        player.position = 1

    elif player.is_activated:
        player.turn_count+=1
        destination=player.position + val
        if(destination<=100):
            player.position = process_movement(destination)
            if(destination==100):
                player.is_winner=True
                game.winner=player_id
        else:
            pass
    
    game.last_roll_value = val
    game.last_roll_player = player_id

    player_ids = list(game.player_statuses.keys())
    current_idx = player_ids.index(player_id)
    next_idx = (current_idx + 1) % len(player_ids)
    game.current_turn = player_ids[next_idx]

    return {
        "value": val,
        "position": player.position,
        "turn": str(next_idx + 1)
    }

def dice(favour:bool=False):
    if favour:
        # 6 has probability 1/3
        return random.choices(
            population=[1, 2, 3, 4, 5, 6],
            weights=[2, 2, 2, 2, 2, 5],  # total = 15, so P(6)=5/15=1/3
            k=1,
        )[0]

    return random.randint(1, 6)

def process_movement(destination:int):
    bite=SNAKES.get(destination)
    if bite:
        return bite
    ladder=LADDERS.get(destination)
    if ladder:
        return ladder
    return destination