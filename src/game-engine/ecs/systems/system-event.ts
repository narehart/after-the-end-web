import { SystemEvent } from "../../game-engine";
import { SystemEventComponent } from "../components";
import { Entity, System } from "../ecs";

export class SystemEventSystem extends System {
  componentsRequired = new Set<Function>([SystemEventComponent]);

  input(entities: Set<Entity>, events: SystemEvent) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const systemEvent = container.get(SystemEventComponent);

      if (systemEvent) {
        systemEvent.events = events;
      }
    }
  }
}
