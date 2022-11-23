import { getRandomInt } from "./helpers.js";

class Game {
  #cards = [];
  #currentCard;

  #totalGuesses = 0;
  #correctGuesses = 0;

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
        (card) =>
          card.cardRarityType !== "rarity_1" &&
          card.cardRarityType !== "rarity_2"
      )
      .map(({ characterId, cardRarityType, prefix, assetbundleName }) => ({
        character: Game.idToCharacterMap[characterId],
        cardRarityType,
        prefix,
        assetbundleName,
      }));
    this.next();
  }

  guess(guess) {
    const isCorrect =
      guess.toLowerCase().trim() === this.#currentCard.character.toLowerCase();

    this.#totalGuesses++;
    if (isCorrect) this.#correctGuesses++;

    return isCorrect;
  }

  skip() {
    this.#totalGuesses++;
  }

  next() {
    const numOfCards = this.#cards.length;

    const idx = Math.floor(Math.random() * numOfCards);
    const selectedCard = this.#cards[idx];
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
      totalGuesses: this.#totalGuesses,
    };
  }
}

export default Game;
