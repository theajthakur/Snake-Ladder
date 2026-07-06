from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import api_router

app = FastAPI(
    title="Snake & Ladder Backend API",
    description="""
This is the RESTful API backend for the **Snake & Ladder** board game.
It supports starting game lobbies, joining active sessions, throwing dice, and retrieving system states.

### Features:
* **Game Management**: Host new games and allow players to join.
* **Gameplay**: Interactive dice rolling, position updates, activation thresholds, and snake/ladder resolution.
* **Turn-based Logic**: Game state keeps track of the active player turn.
""",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "Game Management",
            "description": "Create and join game sessions."
        },
        {
            "name": "Gameplay",
            "description": "Active game operations such as dice rolling."
        },
        {
            "name": "System",
            "description": "General status, sanity checks, and health endpoints."
        }
    ]
)
app.include_router(api_router)

origins = [
    "http://localhost:3000",
    "https://snake-ladder-rouge.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="[IP_ADDRESS]", port=8000)