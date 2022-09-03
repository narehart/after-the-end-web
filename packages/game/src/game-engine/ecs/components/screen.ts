import { Component } from "../ecs";

export class ScreenComponent extends Component {
  constructor(public x: number = 0, public y: number = 0) {
    super();
  }
}
