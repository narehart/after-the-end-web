import { SystemEvent } from "../../game-engine";
import {
  LayerCompoent,
  PointComponent,
  PositionComponent,
  SizeComponent,
  SystemEventComponent,
} from "../components";
import { ComponentContainer, Entity, System } from "../ecs";

const DEFAULT_LAYER = 0;

export class SystemEventSystem extends System {
  componentsRequired = new Set<Function>([SystemEventComponent]);

  input(entities: Set<Entity>, nextEvents: SystemEvent) {
    const sortedEntities = [...entities].sort((a, b) => {
      const containerA = this.ecs.getComponents(a);
      const containerB = this.ecs.getComponents(b);
      const zA = containerA.get(PositionComponent)?.z || DEFAULT_LAYER;
      const zB = containerB.get(PositionComponent)?.z || DEFAULT_LAYER;
      const layerA = containerA.get(LayerCompoent)?.layer || DEFAULT_LAYER;
      const layerB = containerB.get(LayerCompoent)?.layer || DEFAULT_LAYER;

      const orderA = 0.0 + layerA + zA / 1000;
      const orderB = 0.0 + layerB + zB / 1000;

      return orderA < orderB ? 1 : -1;
    });

    const activeLayer = this.getActiveLayer(sortedEntities, nextEvents);

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const layer = this.getLayer(container);
      const events = container.get(SystemEventComponent)!;

      events.events = layer.layer === activeLayer ? nextEvents : undefined;
    }
  }

  getActiveLayer(entities: number[], events: SystemEvent) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const layer = this.getLayer(container);
      const position = this.getPosition(container);
      const size = this.getSize(container);

      const bounds = this.getBounds(position, size);

      const { mousemove } = events.mouse;

      if (this.inBounds(mousemove, bounds)) {
        return layer.layer;
      }
    }

    return DEFAULT_LAYER;
  }

  getLayer(container: ComponentContainer) {
    return container.get(LayerCompoent) || new LayerCompoent(0);
  }

  getPosition(container: ComponentContainer) {
    return container.get(PositionComponent) || new PositionComponent();
  }

  getSize(container: ComponentContainer) {
    return (
      container.get(SizeComponent) ||
      new SizeComponent(
        this.ecs.ge.platform.viewport.x,
        this.ecs.ge.platform.viewport.y
      )
    );
  }

  getBounds(position: PositionComponent, size: SizeComponent) {
    return {
      xMin: position.x,
      yMin: position.y,
      xMax: position.x + size.x,
      yMax: position.y + size.y,
    };
  }

  inBounds(
    position: PointComponent,
    bounds: ReturnType<typeof this.getBounds>
  ) {
    return (
      position.x >= bounds.xMin &&
      position.x <= bounds.xMax &&
      position.y >= bounds.yMin &&
      position.y <= bounds.yMax
    );
  }
}
