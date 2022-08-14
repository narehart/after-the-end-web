import { Component } from "../ecs";

export class PointComponent extends Component {
  constructor(public x: number, public y: number) {
    super();
  }

  scale(n: number) {
    return new PointComponent(this.x * n, this.y * n);
  }

  clone() {
    return new PointComponent(this.x, this.y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
