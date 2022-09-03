import { Component } from "../ecs";

export class CameraManagerComponent extends Component {
  constructor(public arrowPanVelovity: number = 10) {
    super();
  }
}

export class CameraComponent extends Component {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public offsetX: number = 0,
    public offsetY: number = 0
  ) {
    super();
  }
}
