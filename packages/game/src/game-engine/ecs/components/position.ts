import { Component } from "../ecs";

export class PositionComponent extends Component {
  constructor(public x: number, public y: number, public z: number = 0) {
    super();
  }
}
