import { RendererDrawText } from "../../game-engine";
import { Component } from "../ecs";

export class TextComponent extends Component {
  constructor(public options: Omit<RendererDrawText, "x" | "y">) {
    super();
  }
}
