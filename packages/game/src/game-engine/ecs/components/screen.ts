import { Component } from "../ecs";

export class ScreenComponent extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}
