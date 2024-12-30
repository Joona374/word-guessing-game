import { wordObjects } from "./game.js"
import { adjustYourPoints, playerState, yourTurn } from "./states.js"
import { setPlayerState, stepYourTurn } from "./states.js"
import { sendChosenWordLetter, sendRandomLetter, sendGuess } from "./connect.js"
import { handleGameOver, checkIfGameOver } from "./game.js"

const randomLetterButton = document.getElementById("random-letter-button")
const wordLetterButton = document.getElementById("word-letter-button")
const guessWordButton = document.getElementById("guess-word-button")
const wordInput = document.getElementById("word-input")

export const infoText = document.getElementById("info-text")
const pointsContainer = document.getElementById("points-container")
const yourPointsSpan = document.getElementById("your-points-span")
const vsPointsSpan = document.getElementById("vs-points-span")


function removeWordSelectedClass() {
    wordObjects.forEach((wordObject) => {
        wordObject.wordElement.classList.remove("word-selected")
    })
}

function areWordsEqualIgnoreCase(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}

function handleCorrectAnswer(wordObject) {
    const guessedWord = wordObject.guessingWord
    let points = 0;
    for (let i = 0; i < guessedWord.length; i++) {
        if (guessedWord[i] === "-") {
            points += 10
        }
    }

    sendGuess(wordObject.wordIndex, true, guessedWord, points)
    for (let i = 0; i < wordObjects.length; i++) {
        console.log(wordObjects[i].solved)
    }
    wordObject.revealWord()

    adjustYourPoints(points)
    setTimeout(() => {
        checkIfGameOver()
    }, 300)

}

function handleWrongAnswer(wordObject, guessedWord) {
    adjustYourPoints(-10)
    const capitalizedGuess = guessedWord.toUpperCase()
    sendGuess(wordObject.wordIndex, false, capitalizedGuess, -10)
    wordObject.showWrongGuess(capitalizedGuess)
    checkIfGameOver()
}

function cleanWordGuessing() {
    removeWordSelectedClass()
    wordInput.value = ""
    wordInput.style.display = "none"
    infoText.innerText = "Select what to do next"
    guessWordButton.style.backgroundColor = "#666"
    setPlayerState("thinking")
    stepYourTurn()

    if (currentwordInputListener) {
        wordInput.removeEventListener("keydown", currentwordInputListener);
    }

}

let currentwordInputListener;

function wordCheckingFunction(wordObject, event) {
    if (event.key === "Enter") {
        wordInput.style.display = "none";
        console.log(wordInput.value);
        if (areWordsEqualIgnoreCase(wordInput.value, wordObject.fullWord)) {
            console.log("Correct");
            handleCorrectAnswer(wordObject);
            // ### TODO : Finish function to handle correct answer
        } else {
            console.log("Wrong");
            handleWrongAnswer(wordObject, wordInput.value);
        }
        cleanWordGuessing();
    }
}



function wordGuessingFunction(wordObject) {
    if (playerState === "guessing" && [1, 2].includes(yourTurn)) {
        console.log("word guessing function")


        if (currentwordInputListener) {
            wordInput.removeEventListener("keydown", currentwordInputListener);
        }

        if (wordObject.solved === false) {
            currentwordInputListener = (event) => wordCheckingFunction(wordObject, event);
            wordInput.addEventListener("keydown", currentwordInputListener)
            removeWordSelectedClass()
            wordObject.wordElement.classList.add("word-selected")
            wordInput.style.display = "block"
            wordInput.value = ""
            wordInput.focus()
            infoText.textContent = "Please enter a word"
        }
    }

}

function randomLetterEvent() {
    if (playerState === "thinking" && [1, 2].includes(yourTurn)) {
        let unsolverWords = 0
        for (let i = 0; i < wordObjects.length; i++) {
            if (!wordObjects[i].solved) {
                unsolverWords += 1
            }
        }

        if (unsolverWords <= 1) {
            infoText.textContent = "Can't random the last letter"
            return
        }

        while (true) {
            const randomIndex = Math.floor(Math.random() * 5)
            if (wordObjects[randomIndex].guessingWord === wordObjects[randomIndex].fullWord) {
                continue
            }
            let letterIndex = wordObjects[randomIndex].showLetter()
            sendRandomLetter(randomIndex + 1, letterIndex)
            if (wordObjects[randomIndex].guessingWord === wordObjects[randomIndex].fullWord) {
                wordObjects[randomIndex].solved = true
                wordObjects[randomIndex].accidentallyShowWord()
            }
            break
        }
        stepYourTurn()
    }
}

function letterAddingFunction(wordObject) {
    let unshownLetters = 0
    console.log("What?")
    for (let i = 0; i < wordObject.guessingWord.length; i++) {
        if (wordObject.guessingWord[i] === "-") {
            unshownLetters += 1
        }
    }
    console.log(unshownLetters)
    if (unshownLetters <= 1) {
        infoText.textContent = "Can't add last letter"
        return
    }

    if (playerState === "addingLetter" && [1, 2].includes(yourTurn)) {
        let wordIndex = wordObject.wordIndex - 1
        let letterIndex = wordObject.showLetter()
        wordLetterButton.style.backgroundColor = ""

        sendChosenWordLetter(wordIndex, letterIndex, -5)

        stepYourTurn()
        adjustYourPoints(-5)
    }
}


function wordLetterEvent() {
    if (playerState === "thinking" && [1, 2].includes(yourTurn)) {
        console.log("word letter event")
        wordLetterButton.style.backgroundColor = "green"
        infoText.textContent = "Select a word to add a letter to"
        setPlayerState("addingLetter")

        for (let i = 0; i < wordObjects.length; i++) {
            wordObjects[i].wordElement.addEventListener("click", () => letterAddingFunction(wordObjects[i]))
        }
    } else if (playerState === "addingLetter" && [1, 2].includes(yourTurn)) {
        for (let i = 0; i < wordObjects.length; i++) {
            wordObjects[i].wordElement.removeEventListener("click", () => letterAddingFunction(wordObjects[i]))
        }
        wordLetterButton.style.backgroundColor = "#666"
        infoText.textContent = "Select what to do next"
        setPlayerState("thinking")
    }
}
// TODO : The ability to add and remove event listener for word guessing, instead of duplicating them.

function guessAWordEvent() {
    console.log("guess a word")
    if (playerState === "thinking" && [1, 2].includes(yourTurn)) {
        for (let i = 0; i < wordObjects.length; i++) {
            wordObjects[i].wordElement.addEventListener("click", () => wordGuessingFunction(wordObjects[i]))
        }
        infoText.innerText = "Please select a word to guess"
        setPlayerState("guessing")
        guessWordButton.style.backgroundColor = "green"

    } else if (playerState === "guessing" && [1, 2].includes(yourTurn)) {
        for (let i = 0; i < wordObjects.length; i++) {
            wordObjects[i].wordElement.removeEventListener("click", () => wordGuessingFunction(wordObjects[i]))
        }
        removeWordSelectedClass()
        wordInput.style.display = "none"
        infoText.innerText = "Select what to do next"
        guessWordButton.style.backgroundColor = "#666"
        setPlayerState("thinking")

    }

}

export function addEventListeners() {
    randomLetterButton.addEventListener("click", randomLetterEvent);
    wordLetterButton.addEventListener("click", wordLetterEvent);
    guessWordButton.addEventListener("click", guessAWordEvent);
}


