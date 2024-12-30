import { setPlayerState, setYourTurn, yourTurn, adjustVsPoints } from "./states.js";
import { infoText } from "./controls.js";
import { setWords, setGuessingWords, initWords, wordObjects, checkIfGameOver } from "./game.js";

let uuid;
let opponentUuid;

// Establish the WebSocket connection
const socket = new WebSocket(
    `ws://${window.location.host}/ws/game/connect/`
);

// Handle WebSocket connection opening
socket.onopen = function () {
    console.log("WebSocket connection established.");
};

// Handle messages received from the server
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Message received:", data);


    if (data.type == "uuid") {
        receiveUuid(data);
    } else if (data.type == "start_game") {
        receiveGameStart(data);
    } else if (data.type == "random_letter" && data.uuid == opponentUuid) {
        opponentsRandomMove(data);
    } else if (data.type == "chosen_word_letter" && data.uuid == opponentUuid) {
        opponentsChosenWordLetter(data);
    } else if (data.type == "guess_word_right" && data.uuid == opponentUuid) {
        opponentsGuessWordRight(data);
    } else if (data.type == "guess_word_wrong" && data.uuid == opponentUuid) {
        opponentsGuessWordWrong(data);
    } else if (data.type == "accidentally_show_word" && data.uuid == opponentUuid) {
        yellowShowWord(data);
    }
};

// Handle WebSocket connection closing
socket.onclose = function (event) {
    console.log("WebSocket connection closed.");
};

// Handle WebSocket errors
socket.onerror = function (error) {
    console.error("WebSocket error:", error);
};


function receiveGameStart(data) {
    console.log(data);

    setWords(data.words)
    setGuessingWords(data.guessing_words)


    if (data.player1 == uuid) {
        opponentUuid = data.player2
        setYourTurn(1)
        infoText.innerText = "Game Starts! You have 2 turns"

    } else {
        opponentUuid = data.player1
        setYourTurn(false)
        setPlayerState("waitingOpponent")
        infoText.innerText = "Game Starts! Opponent has 2 turns"
    }

    initWords()
};

export function sendRandomLetter(wordIndex, randomIndex) {
    // wordIndex is the number of the word and also wordObject to update
    // randomIndex is the index of the letter that was previously "-" but should now be revealed
    let nextTurn;
    if (yourTurn == "1") {
        nextTurn = uuid;
    } else if (yourTurn == "2") {
        nextTurn = opponentUuid;
    } else {
        console.log("Something wrong")
    }

    socket.send(JSON.stringify({ type: "random_letter", word_index: wordIndex, random_index: randomIndex, next_turn: nextTurn }));
}

export function sendChosenWordLetter(wordIndex, letterIndex, senderPointChange) {
    let nextTurn;
    if (yourTurn == "1") {
        nextTurn = uuid;
    } else if (yourTurn == "2") {
        nextTurn = opponentUuid;
    } else {
        console.log("Something wrong")
    }

    socket.send(JSON.stringify({ type: "chosen_word_letter", word_index: wordIndex, random_index: letterIndex, next_turn: nextTurn, sender_point_change: senderPointChange }));
}

export function sendGuess(wordIndex, right, guess, senderPointChange) {
    let nextTurn;
    if (yourTurn == "1") {
        nextTurn = uuid;
    } else if (yourTurn == "2") {
        nextTurn = opponentUuid;
    } else {
        console.log("Something wrong")
    }

    socket.send(JSON.stringify({ type: "guess_word", word_index: wordIndex, right: right, guess: guess, next_turn: nextTurn, sender_point_change: senderPointChange }));
}

function receiveUuid(data) {
    uuid = data.uuid;
}

export function sendAccidentallyShowWord(wordIndex) {
    socket.send(JSON.stringify({ type: "accidentally_show_word", word_index: wordIndex }));
}

function opponentsRandomMove(data) {
    console.log("Here?")
    wordObjects[data.word_index - 1].showSpecifLetter(data.random_index)
    if (data.next_turn == uuid) {
        setYourTurn(1)
        setPlayerState("thinking")
        infoText.innerText = "You have 2 more turns"
    } else {
        infoText.innerText = "Opponent has 1 more turn"
    }
}

function opponentsChosenWordLetter(data) {
    wordObjects[data.word_index].showSpecifLetter(data.random_index)
    adjustVsPoints(data.sender_point_change)

    if (data.next_turn == uuid) {
        setYourTurn(1)
        setPlayerState("thinking")
        infoText.innerText = "You have 2 more turns"
    } else {
        infoText.innerText = "Opponent has 1 more turn"
    }
}

function opponentsGuessWordRight(data) {
    console.log(data)
    wordObjects[data.word_index - 1].revealWord()
    adjustVsPoints(data.sender_point_change)

    if (data.next_turn == uuid) {
        setYourTurn(1)
        setPlayerState("thinking")
        infoText.innerText = "You have 2 more turns"
    } else {
        infoText.innerText = "Opponent has 1 more turn"
    }

    checkIfGameOver()
}

function opponentsGuessWordWrong(data) {
    wordObjects[data.word_index - 1].showWrongGuess(data.guess)
    adjustVsPoints(data.sender_point_change)

    if (data.next_turn == uuid) {
        setYourTurn(1)
        setPlayerState("thinking")
        infoText.innerText = "You have 2 more turns"
    } else {
        infoText.innerText = "Opponent has 1 more turn"
    }
}

function yellowShowWord(data) {
    wordObjects[data.word_index - 1].accidentallyShowWordForOpponent()
}
