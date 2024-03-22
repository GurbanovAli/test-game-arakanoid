import {
  PositionComponent,
  VelocityComponent,
  CollisionComponent,
} from "../entities";
import * as PIXI from "pixi.js";

export class Ball {
  graphics: PIXI.Graphics;
  velocity: VelocityComponent;
  collision: CollisionComponent;
  position: PositionComponent;

  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    radius: number,
    color: number,
    app: PIXI.Application
  ) {
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(color);
    this.graphics.drawCircle(0, 0, radius);
    this.graphics.endFill();
    this.graphics.x = x;
    this.graphics.y = y;

    this.position = new PositionComponent(x, y);
    this.velocity = new VelocityComponent(velocityX, velocityY);
    this.collision = new CollisionComponent(radius * 2, radius * 2);

    app.stage.addChild(this.graphics as PIXI.DisplayObject);
  }
}
