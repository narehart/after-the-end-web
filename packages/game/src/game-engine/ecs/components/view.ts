import { Component } from "../ecs";

export interface ViewStyle {
  alignItems?: "start" | "center" | "end";
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  justifyContent?: "start" | "center" | "end";
  height?: number;
  width?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export class ViewComponent extends Component {
  constructor(public style?: ViewStyle) {
    super();
  }
}
