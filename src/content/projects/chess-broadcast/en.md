---
key: "chess-broadcast"
lang: "en"
title: "Chess broadcasting"
summary: "A live chess backend driven by recognised board positions."
contribution: "Developed recognition-result ingestion, move reconstruction, game state and WebSocket updates. Worked on transactions, Redis queues and locks, PGN export and Lichess Broadcast integration."
category: "team"
disclosure: "open"
order: 9
featured: false
stack: ["FastAPI", "Redis", "python-chess", "Python", "PostgreSQL", "SQLAlchemy", "Alembic", "WebSocket", "Docker"]
---

## Purpose

The team solution turns a game on a physical chessboard into a digital broadcast. Computer vision recognises the board position; the backend converts results into game state, moves and spectator updates.

## My work

- Developed the API, models, migrations and game lifecycle.
- Processed recognised positions and checked possible moves with python-chess.
- Worked on stabilising recognition results and recovering move sequences.
- Used Redis for queues, locking and duplicate-processing protection.
- Connected game changes to database transactions and WebSocket updates.
- Added PGN generation, Lichess Broadcast synchronisation and a simulated recognition stream for integration checks.

## Technical approach

FastAPI receives data, PostgreSQL stores games, and python-chess validates positions and moves. Queues and locks coordinate incoming events; clients receive current state through WebSocket.

My work covered the backend and computer-vision result integration. Board recognition was a separate part of the team solution.
