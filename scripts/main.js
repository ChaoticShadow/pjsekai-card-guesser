import Game from "./game.js";
import GameCanvas from "./canvas.js";
import GameInfo, { GuessStatus } from "./info.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("version").innerText = "v0.1.6";

  const game = new Game();
  const gameCanvas = new GameCanvas(
    document.getElementById("canvas"),
    document.getElementById("canvas-status")
  );
  const gameInfo = new GameInfo(
    document.getElementById("game-status"),
    document.getElementById("card-info"),
    document.getElementById("game-stats")
  );

  await game.init();
  const { assetbundleName, stub } = game.getCurrentCard();
  gameCanvas.drawCardCropped(assetbundleName, stub);

  const guessInput = document.getElementById("guess-input");
  const guessBtn = document.getElementById("guess-btn");
  const skipBtn = document.getElementById("skip-btn");
  const nextBtn = document.getElementById("next-btn");

  guessInput.value = "";
  nextBtn.disabled = true;

  guessBtn.addEventListener("click", () => {
    const guess = guessInput.value;
    if (guess.length <= 0) {
      return;
    }

    const isCorrect = game.guess(guess);
    gameInfo.updateGuessStatus(
      isCorrect ? GuessStatus.CORRECT : GuessStatus.INCORRECT
    );

    handleAfterGuessOrSkip(
      game,
      gameCanvas,
      gameInfo,
      guessInput,
      guessBtn,
      skipBtn,
      nextBtn
    );
  });

  guessInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const guess = guessInput.value;
      if (guess.length <= 0) {
        return;
      }

      const isCorrect = game.guess(guess);
      gameInfo.updateGuessStatus(
        isCorrect ? GuessStatus.CORRECT : GuessStatus.INCORRECT
      );

      handleAfterGuessOrSkip(
        game,
        gameCanvas,
        gameInfo,
        guessInput,
        guessBtn,
        skipBtn,
        nextBtn
      );
    }
  });

  skipBtn.addEventListener("click", () => {
    game.skip();
    gameInfo.updateGuessStatus(GuessStatus.SKIPPED);

    handleAfterGuessOrSkip(
      game,
      gameCanvas,
      gameInfo,
      guessInput,
      guessBtn,
      skipBtn,
      nextBtn
    );
  });

  nextBtn.addEventListener("click", () => {
    gameInfo.clearGuessStatus();
    gameInfo.clearCorrectCard();
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

function handleAfterGuessOrSkip(
  game,
  gameCanvas,
  gameInfo,
  guessInput,
  guessBtn,
  skipBtn,
  nextBtn
) {
  gameInfo.revealCorrectCard(game.getCurrentCard());
  const { assetbundleName, stub } = game.getCurrentCard();
  gameCanvas.drawCard(assetbundleName, stub);

  guessInput.disabled = true;
  guessBtn.disabled = true;
  skipBtn.disabled = true;
  nextBtn.disabled = false;

  const { correctGuesses, totalGuesses } = game.getGameStats();
  gameInfo.updateGameStats(correctGuesses, totalGuesses);
}
