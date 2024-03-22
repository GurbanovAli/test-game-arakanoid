import { Component } from "./component";

export class CollisionComponent implements Component {
    name = "collision";
    width: number;
    height: number;
  
    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
    }
  }