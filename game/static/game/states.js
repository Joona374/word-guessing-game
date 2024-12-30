import { infoText } from "./controls.js"

export let yourTurn = 1;

export function stepYourTurn(choice) {
    console.log("We are inside step function")
    if (yourTurn === false) {
        playerState = "thinking"
        console.log("player state was false")
        yourTurn = 1
        infoText.innerText = "You have 2 more turns"
    } else if (yourTurn === 1) {
        playerState = "thinking"
        console.log("player state was 1")
        yourTurn = 2
        infoText.innerText = "You have 1 more turn"
    } else if (yourTurn === 2) {
        console.log("player state was 2")
        yourTurn = false
        playerState = "waitingOpponent"
        infoText.innerText = "Waiting for opponent"
    }
}

export function setYourTurn(turn) {
    yourTurn = turn
}

export let yourPoints = 0;
export let yourPointsSpan = document.getElementById("your-points-span");

export function adjustYourPoints(points) {
    yourPoints += points
    yourPointsSpan.innerText = yourPoints
}

export let vsPoints = 0;
export let vsPointsSpan = document.getElementById("vs-points-span");

export function adjustVsPoints(points) {
    vsPoints += points
    vsPointsSpan.innerText = vsPoints
}

export let playerState = "thinking";

export function setPlayerState(state) {
    playerState = state
}

