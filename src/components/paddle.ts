import {
  PositionComponent,
  VelocityComponent,
  CollisionComponent,
} from "../entities";
import * as PIXI from "pixi.js";

export class Paddle {
  graphics: PIXI.Graphics;
  velocity: VelocityComponent;
  collision: CollisionComponent;
  position: PositionComponent;

  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    width: number,
    height: number,
    color: number,
    app: PIXI.Application
  ) {
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(color);
    this.graphics.drawRect(0, 0, width, height);
    this.graphics.endFill();
    this.graphics.x = x;
    this.graphics.y = y;

    this.position = new PositionComponent(x, y);
    this.velocity = new VelocityComponent(velocityX, velocityY);
    this.collision = new CollisionComponent(width, height);

    app.stage.addChild(this.graphics as PIXI.DisplayObject);
  }
}
