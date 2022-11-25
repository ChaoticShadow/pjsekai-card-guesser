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
        this.#guessStatusElement.style.removeProperty("display");
        break;
      case GuessStatus.INCORRECT:
        this.#guessStatusElement.innerText = status;
        this.#guessStatusElement.style.color = "red";
        this.#guessStatusElement.style.removeProperty("display");
        break;
      case GuessStatus.SKIPPED:
        this.#guessStatusElement.innerText = status;
        this.#guessStatusElement.style.color = "yellow";
        this.#guessStatusElement.style.removeProperty("display");
        break;
    }
  }

  clearGuessStatus() {
    this.#guessStatusElement.style.display = "none";
    this.#guessStatusElement.style.removeProperty("color");
    this.#guessStatusElement.innerText = "";
  }

  revealCorrectCard(card) {
    const { prefix, character } = card;

    this.#correctCardElement.innerText = `${character} - ${prefix}`;
    this.#correctCardElement.style.removeProperty("display");
  }

  clearCorrectCard() {
    this.#correctCardElement.style.display = "none";
    this.#correctCardElement.innerText = "";
  }

  updateGameStats(correctGuesses, totalGuesses) {
    this.#gameStatsElement.innerText = `${correctGuesses}/${totalGuesses}`;
  }
}

export default GameInfo;
export { GuessStatus };
