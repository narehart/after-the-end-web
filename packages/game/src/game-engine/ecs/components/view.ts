import { Component } from "../ecs";
import { PointComponent } from "./point";

export interface ViewStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  height?: number;
  width?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export class ViewComponent extends Component {
  public xStart = 0;
  public yStart = 0;
  public xEnd = 0;
  public yEnd = 0;
  public points: PointComponent[] = [];
  public border: string = "";
  public fill: string = "";

  constructor(public id: string, public style?: ViewStyle) {
    super();
  }
}
