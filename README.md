# Snake and Ladder Multiplayer

A web-based digital implementation of the classic Snake and Ladder board game. The application supports offline local play and real-time online multiplayer lobbies.

---

## Architecture Overview

The system is split into two main components:
* **Frontend**: Next.js client application written in TypeScript and styled with Tailwind CSS. It handles user inputs, board rendering, scaling logic, and animations.
* **Backend**: FastAPI web server in Python. It manages concurrent game lobbies, keeps track of active game states in memory, generates dice rolls, and validates player turns.

---

## Core Features

* **Game Modes**:
  * **Offline Mode**: Supports 1 to 4 local players using local state management.
  * **Online Mode**: Supports 2 to 4 players. Lobbies are created on the server and joined using generated room codes.
* **Responsive Visuals**:
  * Auto-scaling layout container driven by `ResizeObserver` to fit various viewport dimensions.
  * Cell-by-cell token transitions and linear slide animations for snakes and ladders.
* **UI Interactions**:
  * **Dice Roller**: Animation wrapper that runs for a minimum of 1 second to ensure rolling duration feedback.
  * **Hover Predictions**: Highlights cells for potential rolls [2-6] to show landing outcomes, including snakes (red) and ladders (green).
  * **Sound Control**: Independent volume toggles that mute board actions (stepping, sliding, winning) while keeping general UI audio triggers active.
  * **Nickname Suggestions**: Automatically assigns a random short name on lobby entry, which users can customize.

---

## Security Model

The online multiplayer mode uses a server-authoritative design to ensure fair play:

* **Server-Authoritative State**: All critical game data, including player positions, turn sequences, and validation flags, are stored and updated on the backend server.
* **Server-Side Roll Generation**: Dice values are generated on the server. The client cannot inject or send roll values.
* **Input Validation**: The server validates all incoming player actions. Requests made out of turn, or rolls on completed games, are rejected.
* **Session Lifecycle**:
  * **Room Expiration**: Every join or roll action updates the room's `last_interaction` timestamp. An asynchronous background task checks the rooms list every 30 seconds and purges any session that has been inactive for more than 5 minutes.
  * **Completion Lock**: Once a player reaches cell 100, the game is flagged as completed. The server blocks all subsequent actions for that session and stops updating the interaction timestamp, letting the session expire and clean up automatically.

---

## Technology Stack

### Client (Frontend)
* **Framework**: React, Next.js (App Router), TypeScript.
* **CSS Framework**: Tailwind CSS.
* **Asset Libraries**: Lucide React.
* **Audio Player**: Preloaded HTML5 Audio API client wrapper.

### Server (Backend)
* **Framework**: Python 3, FastAPI.
* **Data Validation**: Pydantic.
* **Web Server**: Uvicorn.
* **Concurrency**: Thread-safe in-memory room store.

---

## Game Rules

1. **Board Layout**: A 10x10 grid from cell 1 to 100.
2. **Game Entry**: Players begin off-board (position 0). A player must roll a 6 to enter the board at cell 1.
3. **Snakes & Ladders**:
   * Landing on a Ladder moves the player to a designated higher cell.
   * Landing on a Snake moves the player to a designated lower cell.
4. **Victory Condition**: A player must reach cell 100 with an exact dice roll. If the roll value exceeds the remaining distance, the token remains stationary and the turn is passed.

---

## Installation and Setup

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)

### 1. Backend Setup
1. Navigate to the backend directory:
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
   The API documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend folder containing the server URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
   Access the application in your browser at `http://localhost:3000`.

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __init__.py     # API endpoints and lifecycle cleanup task
│   │   │   ├── schemas.py      # Request/response validation schemas
│   │   │   └── utils.py        # Dice rolling utility and process movement
│   │   ├── utils/
│   │   │   └── game.py         # Memory state and core game loop structure
│   │   └── main.py             # FastAPI entrypoint and CORS middleware
│   └── requirements.txt        # Python backend packages
│
└── frontend/
    ├── app/
    │   ├── _components/        # Board, Dice, and HUD components
    │   ├── _store/             # Local offline state management
    │   ├── _utils/             # Sound player
    │   ├── play/
    │   │   ├── offline/        # Local offline play screen
    │   │   └── online/         # Online multiplayer play screen
    │   ├── globals.css         # Styling rules
    │   └── page.tsx            # Main Landing page
    └── lib/
        ├── api.ts              # Axios configuration
        └── game.ts             # API client functions
```
