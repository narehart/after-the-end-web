import { Component } from "../ecs";

export class SpriteComponent<T extends string> extends Component {
  constructor(
    public id: T,
    public sx?: number,
    public sy?: number,
    public w?: number,
    public h?: number
  ) {
    super();
  }
}
