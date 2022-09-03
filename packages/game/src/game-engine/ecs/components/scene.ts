import { Component } from "../ecs";
import { PointComponent } from "./point";

export class SceneManagerComponent extends Component {
  constructor(public size: PointComponent) {
    super();
  }
}

export class SceneComponent extends Component {
  constructor(public size: PointComponent = new PointComponent(0, 0)) {
    super();
  }
}
