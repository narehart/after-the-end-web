import { SceneComponent, SceneManagerComponent } from "../components";
import { Entity, System } from "../ecs";

export class SceneSystem extends System {
  componentsRequired = new Set<Function>([SceneComponent]);

  update(entities: Set<Entity>) {
    let manager;

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      manager = container.get(SceneManagerComponent);

      if (manager) break;
    }

    if (!manager) return;

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const scene = container.get(SceneComponent);

      if (!scene) return;

      scene.size.x = manager.size.x;
      scene.size.y = manager.size.y;
    }
  }
}
