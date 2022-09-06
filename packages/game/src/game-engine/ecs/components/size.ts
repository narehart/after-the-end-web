import { Component } from "../ecs";

export class SizeComponent extends Component {
  constructor(public x: number = 0, public y: number = 0) {
    super();
  }
}
