import * as PIXI from "pixi.js";
import { Paddle, Ball, Block, PointerMoveHandler } from ".";
import {
  APP_COLOR,
  APP_HEIGHT,
  APP_WIDTH,
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
} from "../config/config";
import { updateScoreHistory } from "../utils/score";
import { GameState } from "../types/types";

export class Game {
  blocks: Block[] = [];
  app: PIXI.Application;
  score: number;
  gameText: PIXI.Text;
  paddle: Paddle;
  ball: Ball;
  pointerMoveHandler: PointerMoveHandler;
  playerNameInput: HTMLInputElement;
  saveButton: HTMLElement | null;

  startHandler = () => this.start();

  constructor() {
    const app = new PIXI.Application({
      width: APP_WIDTH,
      height: APP_HEIGHT,
      backgroundColor: APP_COLOR,
    });
    this.app = app;

    const gameContainer = document.getElementById("gameContainer");
    gameContainer?.appendChild(app.view as unknown as Node);

    this.score = 0;
    this.gameText = new PIXI.Text(GameState.Over, {
      fill: 0xffffff,
      fontSize: 48,
      fontWeight: "bold",
    });
    this.gameText.anchor.set(0.5);
    this.gameText.position.set(app.screen.width / 2, app.screen.height / 2);

    const paddleStartX = app.screen.width / 2 - PADDLE_WIDTH / 2;
    const paddleStartY = app.screen.height - PADDLE_HEIGHT - 10;
    const ballStartX = app.screen.width / 2;
    const ballStartY = app.screen.height / 2;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const { color, scorePoint } =
          BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        const block = new Block(col * BLOCK_WIDTH, row * BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT, color, scorePoint, app);
        this.blocks.push(block);
      }
    }
    this.paddle = new Paddle(paddleStartX, paddleStartY, 0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR, app);
    this.ball = new Ball(ballStartX, ballStartY, BALL_SPEED, BALL_SPEED, BALL_RADIUS, BALL_COLOR, app);

    this.pointerMoveHandler = new PointerMoveHandler(app, this.paddle);
    this.playerNameInput = document.getElementById(
      "playerName"
    ) as HTMLInputElement;
    this.saveButton = document.getElementById("saveButton");

    this.createListener();
  }

  start(): void {
    const playerName = this.playerNameInput.value;
    if (!playerName) {
      alert("Please enter your name before start game");
      return;
    }

    if (this.gameText.text === GameState.Win) {
      this.gameText.text = GameState.Over;
    }

    this.gameText.visible = false;

    this.blocks.forEach((block) => (block.graphics.visible = true));

    this.ball.graphics.visible = true;
    this.paddle.graphics.visible = true;

    if (this.saveButton) {
      this.playerNameInput.value = "";
      this.saveButton.removeEventListener("click", this.startHandler);
    }

    if ("ontouchstart" in document.documentElement) {
      document.addEventListener(
        "touchmove",
        this.pointerMoveHandler.handleEvent.bind(this.pointerMoveHandler)
      );
    } else {
      document.addEventListener(
        "mousemove",
        this.pointerMoveHandler.handleEvent.bind(this.pointerMoveHandler)
      );
    }
    this.app.ticker.add(this.update, this);
  }

  update(): void {
    const ballPosition = this.ball.position;
    const ballVelocity = this.ball.velocity;

    ballPosition.x += ballVelocity.vx * 1.5;
    ballPosition.y += ballVelocity.vy * 1.5;

    const ballGraphics = this.ball.graphics;
    ballGraphics.x = ballPosition.x;
    ballGraphics.y = ballPosition.y;

    if (ballPosition.x <= 0 || ballPosition.x > this.app.screen.width) {
      ballVelocity.vx *= -1;
    }
    if (ballPosition.y <= 0) {
      ballVelocity.vy *= -1;
    }
    if (ballPosition.y >= this.app.screen.height) {
      this.restart();
      return;
    }

    const paddlePosition = this.paddle.position;
    const paddleCollision = this.paddle.collision;

    if (
      ballPosition.x + BALL_RADIUS >= paddlePosition.x &&
      ballPosition.x - BALL_RADIUS <=
        paddlePosition.x + paddleCollision.width &&
      ballPosition.y + BALL_RADIUS >= paddlePosition.y
    ) {
      ballVelocity.vy *= -1;
    }

    let visibleBlocks = 0;

    for (const block of this.blocks) {
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
          this.score += block.scorePoint;
        }
      }

      if (block.graphics.visible) {
        visibleBlocks++;
      }
    }

    if (visibleBlocks === 0) {
      this.gameText.text = GameState.Win;
      this.gameText.visible = true;
      this.app.stage.addChild(this.gameText as PIXI.DisplayObject);
      this.restart();
      return;
    }
  }

  restart(): void {
    updateScoreHistory(this.playerNameInput, this.score);
    this.createListener();

    this.blocks.forEach((block) => (block.graphics.visible = false));

    this.ball.graphics.visible = false;
    this.paddle.graphics.visible = false;

    this.gameText.visible = true;
    this.app.stage.addChild(this.gameText as PIXI.DisplayObject);

    this.ball.position.x = this.app.screen.width / 2;
    this.ball.position.y = this.app.screen.height / 2;

    const ballVelocity = this.ball.velocity;
    ballVelocity.vx = BALL_SPEED;
    ballVelocity.vy = BALL_SPEED;

    const paddleStartX = this.app.screen.width / 2 - PADDLE_WIDTH / 2;

    const paddlePosition = this.paddle.position;
    paddlePosition.x = paddleStartX;

    this.score = 0;

    this.app.ticker.remove(this.update, this);
  }

  createListener = (): void => {
    if (this.saveButton && this.playerNameInput) {
      this.saveButton.addEventListener("click", this.startHandler);
      this.playerNameInput.value = "";
    }
  };
}
