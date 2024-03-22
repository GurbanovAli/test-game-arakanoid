import {
  PositionComponent,
  CollisionComponent,
} from "../entities";
import * as PIXI from "pixi.js";

export class Block {
  graphics: PIXI.Graphics;
  collision: CollisionComponent;
  position: PositionComponent;
  scorePoint: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    scorePoint: number,
    app: PIXI.Application
  ) {
    this.graphics = new PIXI.Graphics();
    const borderColor = 0x808080;

    this.graphics.lineStyle(2, borderColor);
    this.graphics.beginFill(color);
    this.graphics.drawRect(0, 0, width, height);
    this.graphics.endFill();
    this.graphics.x = x;
    this.graphics.y = y;

    this.position = new PositionComponent(x, y);
    this.collision = new CollisionComponent(width, height);
    this.scorePoint = scorePoint;

    app.stage.addChild(this.graphics as PIXI.DisplayObject);
  }
}
