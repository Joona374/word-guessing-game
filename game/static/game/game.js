let words = []
export function setWords(wordsList) {
    words = wordsList
}

let guessingWords = []
export function setGuessingWords(guessingWordsList) {
    guessingWords = guessingWordsList
}

export let wordObjects = []


let wordElementsList = []
let letterElementsList = []

import { addEventListeners } from "./controls.js"
export function initWords() {
    for (let i = 1; i <= 5; i++) {
        getWordAndLetterElements(i, wordElementsList, letterElementsList)
    }

    for (let i = 0; i < 5; i++) {
        const word = new Word(i + 1, wordElementsList[i], letterElementsList[i], words[i], guessingWords[i])
        word.displayGuessingWord()
        wordObjects.push(word)
    }
    addEventListeners()
}

export function checkIfGameOver() {
    console.log("check if game over")
    for (let i = 0; i < wordObjects.length; i++) {
        if (!wordObjects[i].solved) {
            console.log("game not over")
            return false
        }
    }
    handleGameOver()
    return true
}

import { infoText } from "./controls.js"
import { yourPoints, vsPoints, setPlayerState } from "./states.js"

export function handleGameOver() {
    console.log("game over")
    if (yourPoints > vsPoints) {
        infoText.innerText = "Game over! You won!"
    } else {
        infoText.innerText = "Game over! You lost."
    }

    setPlayerState("gameOver")

}

import { sendAccidentallyShowWord } from "./connect.js"

class Word {
    constructor(wordIndex, wordElement, letterElements, fullWord, guessingWord) {
        this.wordIndex = wordIndex
        this.wordElement = wordElement
        this.letterElements = letterElements
        this.fullWord = fullWord
        this.guessingWord = guessingWord
        this.solved = false;
    }

    revealWord() {
        this.solved = true
        this.guessingWord = this.fullWord
        for (let i = 0; i < this.fullWord.length; i++) {
            setTimeout(() => {
                this.letterElements[i].textContent = this.fullWord[i]
                this.letterElements[i].style.backgroundColor = "green"
            }, i * 200)
        }

    }

    showWrongGuess(answer) {
        for (let i = 0; i < this.fullWord.length; i++) {
            setTimeout(() => {
                if (this.guessingWord[i] === "-") {
                    this.letterElements[i].style.backgroundColor = "red"
                    this.letterElements[i].textContent = answer[i]
                }
            }, i * 200)
        }
        setTimeout(() => {
            for (let i = 0; i < this.letterElements.length; i++) {
                setTimeout(() => {
                    if (this.guessingWord[i] === "-") {
                        this.letterElements[i].style.backgroundColor = ""
                        this.letterElements[i].textContent = ""
                    }
                }, i * 200)
            }
        }, this.fullWord.length * 800)
    }

    accidentallyShowWord() {
      this.solved = true;
      this.guessingWord = this.fullWord;

      for (let i = 0; i < this.fullWord.length; i++) {
        setTimeout(() => {
          this.letterElements[i].textContent = this.fullWord[i];
          this.letterElements[i].style.backgroundColor = "yellow";
          this.letterElements[i].style.color = "black";
        }, i * 200);
      }
      sendAccidentallyShowWord(this.wordIndex);
    }

    accidentallyShowWordForOpponent() {
      this.solved = true;
      this.guessingWord = this.fullWord;

      for (let i = 0; i < this.fullWord.length; i++) {
        setTimeout(() => {
          this.letterElements[i].textContent = this.fullWord[i];
          this.letterElements[i].style.backgroundColor = "yellow";
          this.letterElements[i].style.color = "black";
        }, i * 200);
      }
    }

    showLetter() {
        while (this.guessingWord !== this.fullWord) {
            const randomIndex = Math.floor(Math.random() * this.fullWord.length)
            if (this.guessingWord[randomIndex] === "-") {
                let newGuessinsWord = ""
                for (let i = 0; i < this.guessingWord.length; i++) {
                    if (i === randomIndex) {
                        newGuessinsWord += this.fullWord[i]
                        this.letterElements[i].style.color = "yellow"
                    } else {
                        newGuessinsWord += this.guessingWord[i]
                    }
                }

                this.guessingWord = newGuessinsWord
                this.displayGuessingWord()


                return randomIndex // Return the index of the revealed letter
            }
        }
    }

    showSpecifLetter(letterIndex) {
        let newGuessinsWord = ""
        for (let i = 0; i < this.guessingWord.length; i++) {
            if (i === letterIndex) {
                newGuessinsWord += this.fullWord[i]
                this.letterElements[i].style.color = "yellow"
            } else {
                newGuessinsWord += this.guessingWord[i]
            }
        }

        this.guessingWord = newGuessinsWord
        this.displayGuessingWord()
    }

    displayGuessingWord() {
        for (let j = 0; j < this.letterElements.length; j++) {
            if (j >= this.guessingWord.length) {
                this.letterElements[j].textContent = ""
                this.letterElements[j].style.display = "none"
            } else {
                if (this.guessingWord[j] !== "-") {
                    this.letterElements[j].textContent = this.guessingWord[j]
                    this.letterElements[j].style.display = "flex"
                    this.letterElements[j].style.textAlign = "center"
                }
            }
        }

    }
}

// displayGuessingWords(guessingWords, letterElementsList)




function getWordAndLetterElements(number, wordElementsList, letterElementsList) {
    const wordElement = document.querySelector(`.word.w${number}`)
    wordElementsList.push(wordElement)
    const letterElements = wordElement.querySelectorAll(".letter")
    letterElementsList.push(letterElements)
}

function generateGuessingWords(wordsList) {
    let localGuessingWords = []
    for (let i = 0; i < wordsList.length; i++) {
        const word = wordsList[i]
        let guessingWord = ""
        for (let j = 0; j < word.length; j++) {
            if (Math.random() < 0.2) {
                guessingWord += word[j]
            } else {
                guessingWord += "-"
            }
        }
        localGuessingWords.push(guessingWord)
    }

    console.log(`Local Guessing Words: ${localGuessingWords}`)
    return localGuessingWords
}

