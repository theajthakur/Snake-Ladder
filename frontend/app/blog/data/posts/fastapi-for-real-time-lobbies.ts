import { BlogPost } from '../blogRegistry'

export const post: BlogPost = {
  "id": "blog-post-fastapi-for-real-time-lobbies",
  "slug": "fastapi-for-real-time-lobbies",
  "title": "FastAPI & WebSockets: Building the Backend for Real-Time Lobbies",
  "metaTitle": "FastAPI WebSockets Real-Time Game Dev | Blog Hub",
  "metaDescription": "Discover how to implement real-time multiplayer lobbies using WebSockets and FastAPI. Read our detailed architectural developer log.",
  "excerpt": "Curious how real-time multiplayer lobbies sync actions instantly across different devices? Read our architectural guide to WebSockets and FastAPI.",
  "coverImage": "/og-image.png",
  "author": {
    "name": "Vijay Thakur",
    "role": "Lead Developer & System Architect",
    "avatar": "/logo.png"
  },
  "publishDate": "2026-04-10",
  "updatedDate": "2026-07-17",
  "category": "development",
  "tags": [
    "fastapi",
    "websockets",
    "python",
    "backend dev"
  ],
  "readingTime": "6 min read",
  "keywords": [
    "fastapi websockets tutorial",
    "real time lobby engine",
    "python websocket server",
    "multiplayer state synchronization"
  ],
  "sections": [
    {
      "heading": "Why We Chose FastAPI & WebSockets",
      "paragraphs": [
        "When designing a real-time multiplayer browser game, communication latency is the most critical factor. Standard HTTP polling (where the client repeatedly asks the server for updates) is slow, creates high CPU usage, and floods the server with redundant requests.",
        "To achieve instantaneous token steps and synchronize turns across multiple device screens, we needed a persistent, bi-directional communication channel. WebSockets provide exactly this by upgrading a standard HTTP connection into a long-lived socket. We chose FastAPI due to its async design, fast execution benchmarks, and built-in support for ASGI routing protocols."
      ]
    },
    {
      "heading": "Lobby State Synchronization Mechanics",
      "paragraphs": [
        "In our architecture, the backend server maintains the source of truth for all rooms in a memory cache. When a player creates an online match, the server generates a unique game session object, mapping active players, lobby coordinates, and connection socket IDs.",
        "Here is the sequence of socket state communication:",
        "1. Connecting: The client initiates a WebSocket connection at `/ws/{game_id}/{player_id}`. The backend validates the player slot, accepts the handshake, and adds the client socket to a broadcast group.",
        "2. Action Dispatch: When a player rolls, the client dispatches a roll signal. The backend processes the state, validates turn order, updates positions, and formats a JSON payload.",
        "3. Broadcast: The server iterates through all active client socket connections in the room group and sends the JSON state update, initiating visual animations simultaneously on all screens."
      ]
    },
    {
      "heading": "WebSocket Manager Implementation",
      "paragraphs": [
        "Below is a simplified Python model of the active connection manager used in our FastAPI backend to coordinate broadcast events and clean up inactive connections:"
      ],
      "codeBlock": {
        "code": "# Python / FastAPI WebSocket Broadcast Manager\nfrom typing import Dict, List\nfrom fastapi import WebSocket\n\nclass LobbyConnectionManager:\n    def __init__(self):\n        # Maps Room ID to a list of active WebSockets\n        self.active_rooms: Dict[str, List[WebSocket]] = {}\n\n    async def connect(self, game_id: str, websocket: WebSocket):\n        await websocket.accept()\n        if game_id not in self.active_rooms:\n            self.active_rooms[game_id] = []\n        self.active_rooms[game_id].append(websocket)\n\n    def disconnect(self, game_id: str, websocket: WebSocket):\n        if game_id in self.active_rooms:\n            self.active_rooms[game_id].remove(websocket)\n            if not self.active_rooms[game_id]:\n                del self.active_rooms[game_id]\n\n    async def broadcast_state(self, game_id: str, state_payload: dict):\n        if game_id in self.active_rooms:\n            for connection in self.active_rooms[game_id]:\n                await connection.send_json(state_payload)",
        "language": "python"
      }
    }
  ],
  "faqs": [
    {
      "question": "What happens if a player loses connection?",
      "answer": "The server retains the player's token slot for 5 minutes. If they reconnect with their player ID (restored from browser local storage), the connection manager reconnects them, sending the active turn state back immediately."
    },
    {
      "question": "How are resources cleaned up?",
      "answer": "A background task scans rooms. If no WebSockets are active for a room for over 5 minutes, the room data is garbage-collected to prevent memory leaks."
    }
  ]
};
