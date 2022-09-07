import { SystemEvent } from "../..";
import { Component } from "../ecs";

export class SystemEventComponent extends Component {
  constructor(public events?: SystemEvent) {
    super();
  }
}
