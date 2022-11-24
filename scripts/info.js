const GuessStatus = {
  CORRECT: "Correct",
  INCORRECT: "Wrong",
  SKIPPED: "Skipped",
};

class GameInfo {
  #correctCardElement;
  #guessStatusElement;
  #gameStatsElement;

  constructor(guessStatusElement, correctCardElement, gameStatsElement) {
    this.#guessStatusElement = guessStatusElement;
    this.#correctCardElement = correctCardElement;
    this.#gameStatsElement = gameStatsElement;
  }

  updateGuessStatus(status) {
    switch (status) {
      case GuessStatus.CORRECT:
        this.#guessStatusElement.innerText = status;
        this.#guessStatusElement.style.color = "green";
        break;
      case GuessStatus.INCORRECT:
        this.#guessStatusElement.innerText = status;
        this.#guessStatusElement.style.color = "red";
        break;
      case GuessStatus.SKIPPED:
        this.#guessStatusElement.innerText = status;
        this.#guessStatusElement.style.color = "yellow";
        break;
    }
  }

  clearGuessStatus() {
    this.#guessStatusElement.innerText = "";
    this.#guessStatusElement.style.removeProperty('color');
  }

  revealCorrectCard(card) {
    const { prefix, character } = card;
    this.#correctCardElement.innerText = `${character} - ${prefix}`;
  }

  clearCorrectCard() {
    this.#correctCardElement.innerText = "";
  }

  updateGameStats(correctGuesses, totalGuesses) {
    this.#gameStatsElement.innerText = `${correctGuesses}/${totalGuesses}`;
  }
}

export default GameInfo;
export { GuessStatus };
