import { getRandomInt } from "./helpers.js";

class GameCanvas {
  #canvas;
  #status;

  constructor(canvas, status) {
    this.#canvas = canvas;
    this.#status = status;
  }

  #draw(
    assetBundleName,
    trained,
    width,
    height,
    xOffset,
    yOffset,
    dWidth,
    dHeight
  ) {
    const stub = trained ? "card_after_training" : "card_normal";

    this.#clear();
    this.#status.innerText = "Loading image...";

    const ctx = this.#canvas.getContext("2d");
    const image = new Image();

    image.addEventListener(
      "load",
      () => {
        this.#status.innerText = "";
        ctx.drawImage(
          image,
          xOffset,
          yOffset,
          width,
          height,
          (this.#canvas.width - dWidth) / 2,
          (this.#canvas.height - dHeight) / 2,
          Math.min(dWidth, this.#canvas.width),
          Math.min(dHeight, this.#canvas.height)
        );
      },
      { once: true }
    );

    image.src = `https://storage.sekai.best/sekai-assets/character/member_small/${assetBundleName}_rip/${stub}.webp`;
  }

  #clear() {
    const ctx = this.#canvas.getContext("2d");
    ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#status.innerText = "";
  }

  drawCard(card) {
    const { assetbundleName, stub } = card;

    const width = 940;
    const height = 530;
    const xOffset = 0;
    const yOffset = 0;

    const dWidth = this.#canvas.width;
    const dHeight = (height * this.#canvas.width) / width;

    this.#draw(
      assetbundleName,
      stub,
      width,
      height,
      xOffset,
      yOffset,
      dWidth,
      dHeight
    );
  }

  drawCardCropped(card) {
    const { assetbundleName, stub, cardRarityType } = card;

    let xMinOffset = 0;
    if (cardRarityType === "rarity_2") {
      xMinOffset = 325;
    }

    const width = getRandomInt(50, 150);
    const height = getRandomInt(50, 150);
    const xOffset = getRandomInt(xMinOffset, 940 - xMinOffset - width);
    const yOffset = getRandomInt(0, 530 - height);

    const dWidth = width * 2;
    const dHeight = height * 2;

    this.#draw(
      assetbundleName,
      stub,
      width,
      height,
      xOffset,
      yOffset,
      dWidth,
      dHeight
    );
  }
}

export default GameCanvas;
