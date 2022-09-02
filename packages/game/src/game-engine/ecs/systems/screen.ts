import { ScreenComponent } from "../components";
import { Entity, System } from "../ecs";

export class ScreenSystem extends System {
  componentsRequired = new Set<Function>([ScreenComponent]);

  init() {
    const screenEntity = this.ecs.addEntity();
    this.ecs.addComponent(screenEntity, new ScreenComponent(0, 0));
  }

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const screen = container.get(ScreenComponent);

      if (!screen) return;

      screen.x = this.ecs.ge.platform.viewport.x;
      screen.y = this.ecs.ge.platform.viewport.y;
    }
  }
}
