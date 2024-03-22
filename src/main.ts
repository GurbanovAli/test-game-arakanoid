import * as PIXI from "pixi.js";
import { Paddle, Ball, Block, PointerMoveHandler } from "./components";
import {
  BALL_COLOR,
  BALL_RADIUS,
  BALL_SPEED,
  BLOCK_COLORS,
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  COLS,
  PADDLE_COLOR,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  ROWS,
} from "./config/config";
import "./style.css";
import { createScoreHistory, updateScoreHistory } from "./utils/score";
import { GameState } from "./types/types";
import { createListener } from "./utils/listener";

(() => {
  const app: PIXI.Application = new PIXI.Application({
    width: 640,
    height: 600,
    backgroundColor: 0x000000,
  });
  const gameContainer = document.getElementById('gameContainer');
  gameContainer?.appendChild(app.view as unknown as Node);

  let score = 0;
  const gameText: PIXI.Text = new PIXI.Text(GameState.Over, {
    fill: 0xffffff,
    fontSize: 48,
    fontWeight: "bold",
  });
  gameText.anchor.set(0.5);
  gameText.position.set(app.screen.width / 2, app.screen.height / 2);

  const playerNameInput = document.getElementById(
    "playerName"
  ) as HTMLInputElement;
  const paddleStartX = app.screen.width / 2 - PADDLE_WIDTH / 2;
  const paddleStartY = app.screen.height - PADDLE_HEIGHT - 10;
  const ballStartX = app.screen.width / 2;
  const ballStartY = app.screen.height / 2;
  const blocks: Block[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const { color, scorePoint } =
        BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
      const block = new Block(col * BLOCK_WIDTH, row * BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT, color, scorePoint, app);
      blocks.push(block);
    }
  }
  const paddle = new Paddle(paddleStartX, paddleStartY, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR, app);
  const ball = new Ball(ballStartX, ballStartY, BALL_SPEED, BALL_SPEED, BALL_RADIUS, BALL_COLOR, app);
  const pointerMoveHandler = new PointerMoveHandler(app, paddle);

  const start = (): void => {
    const saveButton = document.getElementById("saveButton");
    const playerName = playerNameInput.value;
    if (!playerName) {
      alert("Please enter your name before start game");
      return;
    }

    if (gameText.text === GameState.Win) {
      gameText.text = GameState.Over;
    }

    gameText.visible = false;

    blocks.forEach((block: Block) => (block.graphics.visible = true));

    ball.graphics.visible = true;
    paddle.graphics.visible = true;

    if (saveButton) {
      saveButton.removeEventListener("click", start);
    }

    if ("ontouchstart" in document.documentElement) {
      document.addEventListener(
        "touchmove",
        pointerMoveHandler.handleEvent.bind(pointerMoveHandler)
      );
    } else {
      document.addEventListener(
        "mousemove",
        pointerMoveHandler.handleEvent.bind(pointerMoveHandler)
      );
    }
    app.ticker.add(update);
  };

  const restart = (): void => {
    const playerNameInput = document.getElementById(
      "playerName"
    ) as HTMLInputElement;
    updateScoreHistory(playerNameInput, score);
    createListener(start);

    blocks.forEach((block: Block) => (block.graphics.visible = false));

    ball.graphics.visible = false;
    paddle.graphics.visible = false;

    gameText.visible = true;
    app.stage.addChild(gameText as PIXI.DisplayObject);

    ball.position.x = app.screen.width / 2;
    ball.position.y = app.screen.height / 2;

    const ballVelocity = ball.velocity;
    ballVelocity.vx = BALL_SPEED;
    ballVelocity.vy = BALL_SPEED;

    const paddlePosition = paddle.position;
    paddlePosition.x = paddleStartX;

    score = 0;

    app.ticker.remove(update);
  };

  const update = (): void => {
    const ballPosition = ball.position;
    const ballVelocity = ball.velocity;

    ballPosition.x += ballVelocity.vx * 1.5;
    ballPosition.y += ballVelocity.vy * 1.5;

    const ballGraphics = ball.graphics;
    ballGraphics.x = ballPosition.x;
    ballGraphics.y = ballPosition.y;

    if (ballPosition.x <= 0 || ballPosition.x > app.screen.width) {
      ballVelocity.vx *= -1;
    }
    if (ballPosition.y <= 0) {
      ballVelocity.vy *= -1;
    }
    if (ballPosition.y >= app.screen.height) {
      restart();
      return;
    }

    const paddlePosition = paddle.position;
    const paddleCollision = paddle.collision;

    if (
      ballPosition.x + BALL_RADIUS >= paddlePosition.x &&
      ballPosition.x - BALL_RADIUS <=
        paddlePosition.x + paddleCollision.width &&
      ballPosition.y + BALL_RADIUS >= paddlePosition.y
    ) {
      ballVelocity.vy *= -1;
    }

    let visibleBlocks = 0;

    for (const block of blocks) {
      const blockPosition = block.position;
      const blockCollision = block.collision;

      if (
        block.graphics.visible &&
        ballPosition.x + BALL_RADIUS >= blockPosition.x &&
        ballPosition.x - BALL_RADIUS <=
          blockPosition.x + blockCollision.width &&
        ballPosition.y + BALL_RADIUS >= blockPosition.y &&
        ballPosition.y - BALL_RADIUS <= blockPosition.y + blockCollision.height
      ) {
        if (
          ballPosition.x < blockPosition.x ||
          ballPosition.x > blockPosition.x + blockCollision.width
        ) {
          ballVelocity.vx *= -1;
        }
        if (
          ballPosition.y < blockPosition.y ||
          ballPosition.y > blockPosition.y + blockCollision.height
        ) {
          ballVelocity.vy *= -1;
        }

        block.graphics.visible = false;

        if (block.scorePoint !== undefined) {
          score += block.scorePoint;
        }
      }

      if (block.graphics.visible) {
        visibleBlocks++;
      }
    }

    if (visibleBlocks === 0) {
      gameText.text = GameState.Win;
      gameText.visible = true;
      app.stage.addChild(gameText as PIXI.DisplayObject);
      restart();
      return;
    }
  };
  
  createListener(start);
  window.onload = createScoreHistory;
})();
