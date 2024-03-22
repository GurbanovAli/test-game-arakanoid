import { Component } from "./component";

export class PositionComponent implements Component {
    name = "position";
    x: number;
    y: number;
  
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }