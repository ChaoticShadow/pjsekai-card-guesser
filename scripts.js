class Game {
  #cards = [];
  #currentCard;

  #totalGuesses = 0;
  #correctGuesses = 0;

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
      .map(({ characterId, prefix, assetbundleName }) => ({
        character: Game.idToCharacterMap[characterId],
        prefix,
        assetbundleName,
      }));
    this.getNextCard();
  }

  guess(guess) {
    const isCorrect =
      guess.toLowerCase().trim() === this.#currentCard.character.toLowerCase();

    this.#totalGuesses++;
    if (isCorrect) this.#correctGuesses++;

    return isCorrect;
  }

  getCurrentCard() {
    return this.#currentCard;
  }

  getNextCard() {
    const numOfCards = this.#cards.length;

    const idx = Math.floor(Math.random() * numOfCards);
    const isTrained = getRandomInt(0, 2);

    this.#currentCard = {
      ...this.#cards[idx],
      stub: isTrained === 0 ? "card_normal" : "card_after_training",
    };

    return this.#currentCard;
  }

  getGameStats() {
    return {
      correctGuesses: this.#correctGuesses,
      totalGuesses: this.#totalGuesses,
    };
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("version").innerText = "v0.0.10";

  const game = new Game();
  await game.init();
  const {assetbundleName, stub } = game.getCurrentCard();
  updateCanvas(assetbundleName, stub, false);

  const guessInput = document.getElementById("guess-input");
  const guessBtn = document.getElementById("guess-btn");
  const skipBtn = document.getElementById("skip-btn");
  const nextBtn = document.getElementById("next-btn");

  guessBtn.addEventListener("click", () => {
    const guess = guessInput.value;
    if (guess.length <= 0) {
      return;
    }

    const isCorrect = game.guess(guess);
    updateStatus(isCorrect ? "Correct" : "Wrong");

    if (isCorrect) {
      revealCorrectCard(game.getCurrentCard());

      guessInput.disabled = true;
      guessBtn.disabled = true;
      skipBtn.disabled = true;
      nextBtn.disabled = false;
    }

    const { correctGuesses, totalGuesses } = game.getGameStats();
    updateStats(correctGuesses, totalGuesses);
  });

  skipBtn.addEventListener("click", () => {
    updateStatus("Skipped");
    revealCorrectCard(game.getCurrentCard());

    guessInput.disabled = true;
    guessBtn.disabled = true;
    skipBtn.disabled = true;
    nextBtn.disabled = false;
  });

  nextBtn.addEventListener("click", () => {
    updateStatus("");
    clearCorrectCard();
    const { assetbundleName, stub } = game.getNextCard();
    clearCanvas();
    updateCanvas(assetbundleName, stub, false);

    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    skipBtn.disabled = false;
    nextBtn.disabled = true;
  });
});

function updateStatus(status) {
  document.getElementById("status").innerText = status;
}

function updateStats(correctGuesses, totalGuesses) {
  document.getElementById(
    "stats"
  ).innerText = `${correctGuesses}/${totalGuesses}`;
}

function updateCanvas(assetBundleName, stub, full = false) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const image = new Image();
  image.src = `https://assets.pjsek.ai/file/pjsekai-assets/startapp/character/member_small/${assetBundleName}/${stub}.png`;
  image.addEventListener("load", () => {
    let width, height, xOffset, yOffset;
    let dWidth, dHeight;

    if (full) {
      height = 530;
      width = 940;
      xOffset = 0;
      yOffset = 0;

      dWidth = canvas.width;
      dHeight = height * canvas.width / width;
    } else {
      width = getRandomInt(50, 150);
      height = getRandomInt(50, 150);
      xOffset = getRandomInt(0, 940 - width);
      yOffset = getRandomInt(0, 530 - height);

      dWidth = width * 2;
      dHeight = height * 2;
    }
    context.drawImage(
      image,
      xOffset,
      yOffset,
      width,
      height,
      (canvas.width - dWidth) / 2,
      (canvas.height - dHeight) / 2,
      dWidth,
      dHeight
    );
  });
}

function clearCanvas() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function revealCorrectCard(card) {
  const cardInfo = document.getElementById("card-info");

  const { prefix, character } = card;
  cardInfo.innerText = `${character} - ${prefix}`;

  clearCanvas();
  updateCanvas(card.assetbundleName, card.stub, true);
}

function clearCorrectCard() {
  const cardInfo = document.getElementById("card-info");
  cardInfo.innerText = "";
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
