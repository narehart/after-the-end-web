import { Component } from "../ecs";

export class AnimatedSpriteComponent<T extends string> extends Component {
  public start = 0;
  public elapsed = 0;

  constructor(
    public id: T,
    public width: number,
    public duration: number[] | number = 100,
    public loop: boolean = false
  ) {
    super();
  }
}
