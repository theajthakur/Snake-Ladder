# Snake and Ladder Multiplayer

A clean, modern digital version of the classic Snake and Ladder board game. It supports both local offline pass-and-play and online real-time multiplayer lobbies.

---

## Key Features

* **Two Game Modes**:
  * **Offline (Local)**: Play locally with 1 to 4 players and type in custom names.
  * **Online (Multiplayer)**: Host or join games on the server for 2 to 4 players using simple room codes.
* **Modern Design & Visuals**:
  * Clean dark-mode colors and smooth scaling to fit desktop and mobile screens.
  * Step-by-step token walking animations and sliding movements for snakes and ladders.
* **Interactive Elements**:
  * **Dice Roller**: Animated dice roll with sounds. The dice rolls for at least 1 second so players can enjoy the anticipation.
  * **Hover Predictions**: Hovering shows you where you will land for rolls 2 through 6, highlighting snakes (red) and ladders (green).
  * **Selective Mute**: Turn off board action sounds (like stepping and sliding) while keeping button clicks and dice rolls active.
  * **Nickname Generator**: Suggests random funny gaming names when setting up online games, which you can easily customize.

---

## Online Security & Authoritative Backend (100% Fair Play)

The online multiplayer system is designed to be completely fair and cheat-proof. All game calculations happen on the server, not on your device:

* **Server-Run Game Loop**: The actual positions of players, the current turn, and the game status are stored and updated on the backend server.
* **Server-Side Dice Rolls**: When you roll, the server generates the dice value. The client device never chooses the roll value.
* **Zero Client-Side Cheat Control**:
  * The frontend is only used to display the board and take inputs.
  * The server verifies every action (for example, checking if it is actually your turn or verifying if you rolled a 6 to start).
  * Because the game state is not controlled by the client, memory editing tools (like Cheat Engine) or modified client requests cannot be used to cheat.

* **Automatic Room Cleanup**: To manage memory efficiently, the server keeps track of activity. If an online room goes 5 minutes without any player rolling the dice or joining, a background loop automatically deletes that game room and player instances, logging the action in the console.
* **Game Completion Lock**: When a player reaches cell 100, the game is marked as completed. The server blocks all subsequent roll and join requests, and stops updating the last interaction time. This freezes the game until it is automatically deleted by the cleanup loop after 5 minutes of inactivity.

---

## Technology Stack

### Frontend
* **Core**: React, Next.js (App Router), TypeScript.
* **Styling**: Tailwind CSS.
* **Icons**: Lucide React.
* **Sound**: HTML5 Audio preloaded in the browser.

### Backend
* **Core**: Python 3, FastAPI.
* **Validation**: Pydantic.
* **Web Server**: Uvicorn.
* **State**: Thread-safe in-memory room store.

---

## Game Rules

1. **Board**: A 10x10 grid from cell 1 to 100.
2. **Start**: All players start off the board (at cell 0). You must roll a 6 to enter cell 1.
3. **Movement**: Tokens walk cell-by-cell so players can see their path.
4. **Snakes & Ladders**:
   * Landing on a **Ladder** climbs you up to a higher cell.
   * Landing on a **Snake** slides you down to a lower cell.
5. **Winning**: You must land exactly on cell 100 to win. If you roll more than needed, your token stays put and the turn passes.

---

## Installation & Setup

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)

### 1. Backend Setup
1. Open the backend directory:
   ```bash
   cd backend
   ```
2. Install Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   API docs will be available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
1. Open the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder with the server URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __init__.py     # API endpoints (Lobby and Roll handlers)
│   │   │   ├── schemas.py      # Validation schemas
│   │   │   └── utils.py        # Dice utility
│   │   ├── utils/
│   │   │   └── game.py         # Game instance logic
│   │   └── main.py             # FastAPI entrypoint
│   └── requirements.txt        # Backend packages
│
└── frontend/
    ├── app/
    │   ├── _components/        # Board, Dice, and HUD components
    │   ├── _store/             # Local offline state management
    │   ├── _utils/             # Sound player
    │   ├── play/
    │   │   ├── offline/        # Local play screen
    │   │   └── online/         # Online play screen
    │   ├── globals.css         # CSS
    │   └── page.tsx            # Main Landing page
    └── lib/
        ├── api.ts              # Axios client config
        └── game.ts             # API caller functions
```
