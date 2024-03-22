import { Component } from "./component";

export class VelocityComponent implements Component {
    name = "velocity";
    vx: number;
    vy: number;
  
    constructor(vx: number, vy: number) {
      this.vx = vx;
      this.vy = vy;
    }
  }