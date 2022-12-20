import { getRandomInt } from "./helpers.js";

const GameState = {
  READY: "game_ready",
  CORRECT: "card_correct",
  INCORRECT: "card_incorrect",
  SKIPPED: "card_skipped",
};

class Game {
  #cards = [];
  #currentCard;

  #correctGuesses = 0;
  #incorrectGuesses = 0;
  #skippedGuesses = 0;

  #state;

  static idToCharacterMap = {
    1: "Ichika",
    2: "Saki",
    3: "Honami",
    4: "Shiho",
    5: "Minori",
    6: "Haruka",
    7: "Airi",
    8: "Shizuku",
    9: "Kohane",
    10: "An",
    11: "Akito",
    12: "Toya",
    13: "Tsukasa",
    14: "Emu",
    15: "Nene",
    16: "Rui",
    17: "Kanade",
    18: "Mafuyu",
    19: "Ena",
    20: "Mizuki",
    21: "Miku",
    22: "Rin",
    23: "Len",
    24: "Luka",
    25: "MEIKO",
    26: "KAITO",
  };

  async init() {
    const response = await fetch(
      "https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/main/cards.json"
    );
    const data = await response.json();

    if (!Array.isArray(data)) {
      this.#cards = [];
    }

    this.#cards = data
      .filter(
        ({ cardRarityType }) =>
          cardRarityType !== "rarity_1"
      )
      .map(
        ({
          id,
          characterId,
          cardRarityType,
          prefix,
          assetbundleName,
          releaseAt,
        }) => ({
          id,
          character: Game.idToCharacterMap[characterId],
          cardRarityType,
          prefix,
          assetbundleName,
          releaseAt,
        })
      );
    this.next();
  }

  guess(guess) {
    const isCorrect =
      guess.toLowerCase().trim() === this.#currentCard.character.toLowerCase();

    if (isCorrect) {
      this.#state = GameState.CORRECT;
      this.#correctGuesses++;
    } else {
      this.#state = GameState.INCORRECT;
      this.#incorrectGuesses++;
    }
  }

  skip() {
    this.#state = GameState.SKIPPED;

    this.#skippedGuesses++;
  }

  next() {
    this.#state = GameState.READY;

    const numOfCards = this.#cards.length;

    let idx;
    let selectedCard;

    do {
      idx = Math.floor(Math.random() * numOfCards);
      selectedCard = this.#cards[idx];
    } while (selectedCard.releaseAt > Date.now());

    let stub = "card_normal";
    if (
      selectedCard.cardRarityType === "rarity_3" ||
      selectedCard.cardRarityType === "rarity_4"
    ) {
      const isTrained = getRandomInt(0, 2);
      stub = isTrained === 0 ? "card_normal" : "card_after_training";
    }

    this.#currentCard = {
      ...selectedCard,
      stub,
    };
  }

  getCurrentCard() {
    return this.#currentCard;
  }

  getGameStats() {
    return {
      correctGuesses: this.#correctGuesses,
      incorrectGuesses: this.#incorrectGuesses,
      skippedGuesses: this.#skippedGuesses,
      totalGuesses: this.#correctGuesses + this.#incorrectGuesses + this.#skippedGuesses,
    };
  }

  getState() {
    return this.#state;
  }
}

export default Game;
export { GameState };
