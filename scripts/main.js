import Game from "./game.js";
import GameCanvas  from "./canvas.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("version").innerText = "v0.0.12";

  const game = new Game();
  const gameCanvas = new GameCanvas(document.getElementById("canvas"));

  await game.init();
  const {assetbundleName, stub } = game.getCurrentCard();
  gameCanvas.drawCardCropped(assetbundleName, stub);

  const guessInput = document.getElementById("guess-input");
  const guessBtn = document.getElementById("guess-btn");
  const skipBtn = document.getElementById("skip-btn");
  const nextBtn = document.getElementById("next-btn");

  guessBtn.addEventListener("click", () => {
    const guess = guessInput.value;
    handleGuess(game, guess, () =>handleAfterGuessOrSkip(game, gameCanvas, guessInput, guessBtn, skipBtn, nextBtn));
  });

  guessInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const guess = guessInput.value;
      handleGuess(game, guess, () => handleAfterGuessOrSkip(game, gameCanvas, guessInput, guessBtn, skipBtn, nextBtn));
    }
  });

  skipBtn.addEventListener("click", () => {
    updateStatus("Skipped");
    game.skip();
    handleAfterGuessOrSkip(game, gameCanvas, guessInput, guessBtn, skipBtn, nextBtn);
  });

  nextBtn.addEventListener("click", () => {
    updateStatus("");
    clearCorrectCard();
    game.next();
    const { assetbundleName, stub } = game.getCurrentCard();
    gameCanvas.drawCardCropped(assetbundleName, stub);

    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    skipBtn.disabled = false;
    nextBtn.disabled = true;
  });
});

function handleGuess(game, guess, postGuess) {
  if (guess.length <= 0) {
    return;
  }

  const isCorrect = game.guess(guess);
  updateStatus(isCorrect ? "Correct" : "Wrong");
  postGuess();
}

function handleAfterGuessOrSkip(game, gameCanvas, guessInput, guessBtn, skipBtn, nextBtn) {
  revealCorrectCard(game.getCurrentCard());
  const { assetbundleName, stub } = game.getCurrentCard();
  gameCanvas.drawCard(assetbundleName, stub);

  guessInput.disabled = true;
  guessBtn.disabled = true;
  skipBtn.disabled = true;
  nextBtn.disabled = false;

  const { correctGuesses, totalGuesses } = game.getGameStats();
  updateStats(correctGuesses, totalGuesses);
}

function updateStatus(status) {
  document.getElementById("status").innerText = status;
}

function updateStats(correctGuesses, totalGuesses) {
  document.getElementById(
    "stats"
  ).innerText = `${correctGuesses}/${totalGuesses}`;
}

function revealCorrectCard(card) {
  const cardInfo = document.getElementById("card-info");

  const { prefix, character } = card;
  cardInfo.innerText = `${character} - ${prefix}`;
}

function clearCorrectCard() {
  const cardInfo = document.getElementById("card-info");
  cardInfo.innerText = "";
}
