import * as PIXI from "pixi.js";
import { Paddle } from "./paddle";
import { PADDLE_WIDTH } from "../config/config";

export class PointerMoveHandler {
  private app: PIXI.Application;
  private paddle: Paddle;

  constructor(app: PIXI.Application, paddle: Paddle) {
    this.app = app;
    this.paddle = paddle;
  }

  handleEvent(event: MouseEvent | TouchEvent): void {
    if (!this.app.view.getBoundingClientRect) return;

    let clientX: number;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
    } else if (event instanceof TouchEvent) {
      event.preventDefault();
      const touch: Touch = event.touches[0];
      clientX = touch.clientX;
    } else {
      return;
    }

    const canvasElement = this.app.view as HTMLCanvasElement;
    const canvasBounds: DOMRect = canvasElement.getBoundingClientRect();
    const canvasMouseX: number = clientX - canvasBounds.left;
    const newPaddleX: number = canvasMouseX - PADDLE_WIDTH / 2;

    const maxX: number = this.app.screen.width - PADDLE_WIDTH;
    const newXClamped: number = Math.min(Math.max(newPaddleX, 0), maxX);

    const paddlePosition = this.paddle.position;
    const deltaX: number = newXClamped - paddlePosition.x;
    const paddleVelocityX: number = 5;

    this.paddle.velocity.vx =
      deltaX > 0 ? paddleVelocityX : deltaX < 0 ? -paddleVelocityX : 0;

    paddlePosition.x = newXClamped;
    this.paddle.graphics.x = newXClamped;
  }
}
