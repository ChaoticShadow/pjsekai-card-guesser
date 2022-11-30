import { getRandomInt } from "./helpers.js";

class GameCanvas {
  #canvas;

  constructor(canvas) {
    this.#canvas = canvas;
  }

  #draw(
    assetBundleName,
    stub,
    width,
    height,
    xOffset,
    yOffset,
    dWidth,
    dHeight
  ) {
    const ctx = this.#canvas.getContext("2d");
    ctx.fillStyle = "dimgrey";

    const image = new Image();

    image.addEventListener(
      "loadstart",
      () => {
        this.#clear();
        ctx.fillText("Loading image...", 10, 20);
      },
      { once: true }
    );

    image.addEventListener(
      "loaderror",
      () => {
        this.#clear();
        ctx.fillText("Failed to load image.", 10, 20);
      },
      { once: true }
    );

    image.addEventListener(
      "load",
      () => {
        this.#clear();
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

    image.src = `https://assets.pjsek.ai/file/pjsekai-assets/startapp/character/member_small/${assetBundleName}/${stub}.png`;
  }

  #clear() {
    const ctx = this.#canvas.getContext("2d");
    ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  drawCard(assetBundleName, stub) {
    const height = 530;
    const width = 940;
    const xOffset = 0;
    const yOffset = 0;

    const dWidth = this.#canvas.width;
    const dHeight = (height * this.#canvas.width) / width;

    this.#draw(
      assetBundleName,
      stub,
      width,
      height,
      xOffset,
      yOffset,
      dWidth,
      dHeight
    );
  }

  drawCardCropped(assetBundleName, stub) {
    const width = getRandomInt(50, 150);
    const height = getRandomInt(50, 150);
    const xOffset = getRandomInt(0, 940 - width);
    const yOffset = getRandomInt(0, 530 - height);

    const dWidth = width * 2;
    const dHeight = height * 2;

    this.#draw(
      assetBundleName,
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
