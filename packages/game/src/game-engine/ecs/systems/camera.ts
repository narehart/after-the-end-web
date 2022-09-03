import { clamp } from "../../utils/utils";
import {
  CameraComponent,
  CameraManagerComponent,
  SceneComponent,
  ScreenComponent,
  SystemEventComponent,
} from "../components";
import { Entity, System } from "../ecs";

export class CameraManagerSystem extends System {
  componentsRequired = new Set<Function>([CameraManagerComponent]);

  update(entities: Set<Entity>) {
    let manager;

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      manager = container.get(CameraManagerComponent);

      if (manager) break;
    }

    if (!manager) return;

    // update camera based on user input
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const camera = container.get(CameraComponent);
      const screen = container.get(ScreenComponent);
      const scene = container.get(SceneComponent);
      const events = container.get(SystemEventComponent);

      const keys = events?.events.keyboard.keys;

      if (!camera || !screen || !scene || !keys) continue;

      if (keys.includes("ARROW_RIGHT")) {
        camera.x += manager.arrowPanVelovity;
      }
      if (keys.includes("ARROW_LEFT")) {
        camera.x -= manager.arrowPanVelovity;
      }
      if (keys.includes("ARROW_UP")) {
        camera.y -= manager.arrowPanVelovity;
      }
      if (keys.includes("ARROW_DOWN")) {
        camera.y += manager.arrowPanVelovity;
      }

      break;
    }

    // constrain camera bounds
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const screen = container.get(ScreenComponent);
      const scene = container.get(SceneComponent);
      const camera = container.get(CameraComponent);

      if (!camera || !screen || !scene) continue;
      if (screen.x === 0 || screen.y === 0) continue;

      const xMin = screen.x / 2;
      const xMax = scene.size.x - xMin;
      const yMin = screen.y / 2;
      const yMax = scene.size.y - yMin;

      if (scene.size.x <= screen.x) {
        camera.x = xMin;
        camera.offsetX = 0;
      }

      if (scene.size.y <= screen.y) {
        camera.y = yMin;
        camera.offsetY = 0;
      }

      camera.x = Math.floor(clamp(camera.x, xMin, xMax));
      camera.y = Math.floor(clamp(camera.y, yMin, yMax));
      camera.offsetX = Math.floor(Math.max(0, camera.x - screen.x / 2));
      camera.offsetY = Math.floor(Math.max(0, camera.y - screen.y / 2));

      break;
    }
  }
}

export class CameraUpdateSystem extends System {
  componentsRequired = new Set<Function>([CameraComponent]);

  update(entities: Set<Entity>) {
    let nextCamera;

    // get the updated data from the manager
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const manager = container.get(CameraManagerComponent);
      const camera = container.get(CameraComponent);
      const screen = container.get(ScreenComponent);

      if (!manager || !camera || !screen) continue;

      nextCamera = camera;

      break;
    }

    if (!nextCamera) return;

    // update all camera entities with the new data
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const camera = container.get(CameraComponent);

      if (!camera) continue;

      camera.x = nextCamera.x;
      camera.y = nextCamera.y;
      camera.offsetX = nextCamera.offsetX;
      camera.offsetY = nextCamera.offsetY;
    }
  }
}
