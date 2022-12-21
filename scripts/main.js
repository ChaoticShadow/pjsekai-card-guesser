import Game, { CardRarity, GameState } from "./game.js";
import GameCanvas from "./canvas.js";
import {
  createApp,
  reactive,
} from "https://unpkg.com/petite-vue@0.4.1/dist/petite-vue.es.js?module";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version").innerText = "v0.2.3";
});

const game = new Game();
const gameCanvas = new GameCanvas(
  document.getElementById("canvas"),
  document.getElementById("canvas-status")
);

await game.init();

const store = reactive({
  // data
  state: game.getState(),
  card: game.getCurrentCard(),
  stats: game.getGameStats(),

  // computed
  get isGameReady() {
    return this.state === GameState.READY;
  },
  get isGameRevealed() {
    return [GameState.CORRECT, GameState.INCORRECT, GameState.SKIPPED].includes(
      this.state
    );
  },

  // methods
  guessCard(guess) {
    game.guess(guess);
    this.state = game.getState();
    this.stats = game.getGameStats();
  },
  skipCard() {
    game.skip();
    this.state = game.getState();
    this.stats = game.getGameStats();
  },
  nextCard() {
    game.next();
    this.state = game.getState();
    this.card = game.getCurrentCard();
  },
});

createApp({
  // data
  store,
  guess: "",
  opts: [
    "Ichika",
    "Saki",
    "Honami",
    "Shiho",
    "Minori",
    "Haruka",
    "Airi",
    "Shizuku",
    "Kohane",
    "An",
    "Akito",
    "Toya",
    "Tsukasa",
    "Emu",
    "Nene",
    "Rui",
    "Kanade",
    "Mafuyu",
    "Ena",
    "Mizuki",
    "Miku",
    "Rin",
    "Len",
    "Luka",
    "MEIKO",
    "KAITO",
  ],

  // lifecycle hooks
  mounted() {
    gameCanvas.drawCardCropped(this.store.card);
  },

  // methods
  guessCard() {
    if (this.guess.length === 0) return;

    this.store.guessCard(this.guess);
    this.guess = "";

    gameCanvas.drawCard(this.store.card);
  },
  skipCard() {
    this.store.skipCard();

    gameCanvas.drawCard(this.store.card);
  },
  nextCard() {
    this.store.nextCard();

    gameCanvas.drawCardCropped(this.store.card);
  },
}).mount("#input-wrapper");

createApp({
  // data
  store,

  // computed
  get status() {
    const names = {
      [GameState.CORRECT]: "Correct",
      [GameState.INCORRECT]: "Incorrect",
      [GameState.SKIPPED]: "Skipped",
    };

    return names[this.store.state] ?? this.store.state;
  },
  get statusColor() {
    const colors = {
      [GameState.CORRECT]: "green",
      [GameState.INCORRECT]: "red",
      [GameState.SKIPPED]: "yellow",
    };

    return colors[this.store.state] ?? "";
  },
  get cardCharacter() {
    return this.store.card.character;
  },
  get cardName() {
    return this.store.card.prefix;
  },
  get cardLink() {
    return `https://sekai.best/card/${this.store.card.id}`;
  },
  get stats() {
    const { correctGuesses, totalGuesses } = this.store.stats;
    return `${correctGuesses}/${totalGuesses}`;
  },
  get advancedStats() {
    const { correctGuesses, incorrectGuesses, skippedGuesses } =
      this.store.stats;
    return `(${correctGuesses} correct, ${incorrectGuesses} incorrect, ${skippedGuesses} skipped)`;
  },
}).mount("#info-wrapper");

createApp({
  // data
  checkboxes: [
    { name: "allow4Star", label: "4☆", rarity: CardRarity.FOUR_STAR },
    { name: "allowBday", label: "Birthday", rarity: CardRarity.BIRTHDAY },
    { name: "allow3Star", label: "3☆", rarity: CardRarity.THREE_STAR },
    { name: "allow2Star", label: "2☆", rarity: CardRarity.TWO_STAR },
  ],
  numChecked: 4,
  numOfCardsInPool: game.getNumberOfCardsInPool(),

  // methods
  handleChange(event, rarity) {
    const {
      target: { checked },
    } = event;

    if (!checked && this.numChecked <= 1) {
      event.preventDefault();
      event.target.checked = true;
      return false;
    }

    game.setRarityInCardPool(rarity, checked);
    if (checked) {
      this.numChecked++;
    } else {
      this.numChecked--;
    }
    this.numOfCardsInPool = game.getNumberOfCardsInPool();
  },
}).mount("#options-wrapper");
