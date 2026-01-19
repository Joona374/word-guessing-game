# Word Guessing Game

A real-time multiplayer word guessing game built with Django and WebSockets. Two players connect and compete to guess Finnish words letter by letter.

## Features

- **Real-time Multiplayer**: WebSocket-based matchmaking and gameplay
- **Turn-based Gameplay**: Players take turns revealing letters to guess words
- **Player Matching**: Automatic pairing of two players when they connect
- **User Authentication**: Registration and login system
- **Mobile-friendly**: Designed for mobile play

## Tech Stack

- **Backend**: Django 5.1, Django Channels
- **WebSockets**: Channels with Redis for real-time communication
- **Database**: SQLite (development)
- **Frontend**: Vanilla JavaScript
- **Server**: Daphne ASGI server

## Project Structure

```
word-guessing-game/
├── manage.py
├── word_guessing_game/    # Project configuration
│   ├── settings.py
│   ├── asgi.py           # WebSocket configuration
│   └── urls.py
└── game/                  # Game application
    ├── consumers.py       # WebSocket handlers
    ├── models.py          # Database models
    ├── views.py           # HTTP views
    ├── utils.py           # Game logic & word list
    ├── static/game/       # JavaScript (most of the gamelogic) & CSS
    └── templates/game/    # HTML templates
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Run the development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

## How to Play

1. Register an account or log in
2. Navigate to the play page
3. Wait for another player to connect
4. Take turns revealing letters and guessing the words
5. When all words are guessed, the player with the most points wins!

## Game Rules
- 5 Finnish words are selected at the start, with some letters initially revealed (20% chance per letter)
- Players take turns performing one action each turn
- Three possible actions per turn:
    - Random Letter: Reveals a random letter in a random word (free, but can't use on last remaining word)
    - Choose Letter: Reveals one letter in a chosen word (costs -5 points, can't reveal the last letter)
    - Guess Word: Attempt to guess a word
- Correct guess: +10 points per unrevealed letter
- Wrong guess: -10 points (wrong letters briefly shown in red)
- Automatically solved words: If all letters are revealed accidentally, the word is solved (shown in yellow) with no points awarded
- Game ends when all 5 words are solved
- Winner is the player with the most points


## Local Multiplayer

This game is designed for local network play. Start the server on one device and connect from multiple devices on the same network using the host device's IP address.

## Note

A personal project built for casual mobile gaming with friends. Uses Finnish words for gameplay.
