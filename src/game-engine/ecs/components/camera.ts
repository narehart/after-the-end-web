import { Component } from "../ecs";

export class CameraComponent extends Component {
  constructor(
    public x: number,
    public y: number,
    public offsetX: number = 0,
    public offsetY: number = 0
  ) {
    super();
  }
}
