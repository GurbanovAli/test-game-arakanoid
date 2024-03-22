import * as PIXI from "pixi.js";

export interface Component {
  name: string;
  graphics?: PIXI.Graphics;
}
