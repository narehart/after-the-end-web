import { Component } from "../ecs";

export class PositionComponent extends Component {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {
    super();
  }
}
