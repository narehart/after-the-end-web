import { Component } from "../ecs";
import { PointComponent } from "./point";

export class PolygonComponent extends Component {
  constructor(
    public points: PointComponent[],
    public border?: string,
    public fill?: string
  ) {
    super();
  }
}
