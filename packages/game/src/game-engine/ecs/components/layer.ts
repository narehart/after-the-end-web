import { Component } from "../ecs";

export class LayerCompoent extends Component {
  constructor(public layer: number = 0) {
    super();
  }
}
