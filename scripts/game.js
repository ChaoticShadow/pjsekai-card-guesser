import { getRandomInt } from "./helpers.js";

const CardRarity = {
  FOUR_STAR: "rarity_4",
  BIRTHDAY: "rarity_birthday",
  THREE_STAR: "rarity_3",
  TWO_STAR: "rarity_2",
  ONE_STAR: "rarity_1",
};

const GameState = {
  READY: "game_ready",
  CORRECT: "card_correct",
  INCORRECT: "card_incorrect",
  SKIPPED: "card_skipped",
};

class Game {
  #cardsByRarity = {};
  #cardPool = [];
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
      this.#cardPool = [];
    }

    data
      .filter(({ cardRarityType }) => cardRarityType !== CardRarity.ONE_STAR)
      .forEach(
        ({
          id,
          characterId,
          cardRarityType,
          prefix,
          assetbundleName,
          releaseAt,
        }) => {
          if (typeof this.#cardsByRarity[cardRarityType] === "undefined")
            this.#cardsByRarity[cardRarityType] = { included: true, cards: [] };

          const card = {
            id,
            character: Game.idToCharacterMap[characterId],
            cardRarityType,
            prefix,
            assetbundleName,
            releaseAt,
          };

          this.#cardsByRarity[cardRarityType].cards.push(card);
          this.#cardPool.push(card);
        }
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

    const numOfCards = this.#cardPool.length;

    let idx;
    let selectedCard;

    do {
      idx = Math.floor(Math.random() * numOfCards);
      selectedCard = this.#cardPool[idx];
    } while (selectedCard.releaseAt > Date.now());

    let trained = false;
    if (
      selectedCard.cardRarityType === CardRarity.THREE_STAR ||
      selectedCard.cardRarityType === CardRarity.FOUR_STAR
    ) {
      const isTrained = getRandomInt(0, 2);
      trained = isTrained === 0;
    }

    this.#currentCard = {
      ...selectedCard,
      trained,
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
      totalGuesses:
        this.#correctGuesses + this.#incorrectGuesses + this.#skippedGuesses,
    };
  }

  getState() {
    return this.#state;
  }

  setRarityInCardPool(rarity, inCardPool) {
    if (typeof this.#cardsByRarity[rarity] === "undefined") return;

    this.#cardsByRarity[rarity].included = inCardPool;

    this.#cardPool = [];
    Object.values(this.#cardsByRarity).forEach(({ included, cards }) => {
      if (included) this.#cardPool = [...this.#cardPool, ...cards];
    });
  }

  getNumberOfCardsInPool() {
    return this.#cardPool.length;
  }
}

export default Game;
export { CardRarity, GameState };
