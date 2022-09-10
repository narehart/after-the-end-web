import { Renderer } from "../../game-engine";
import {
  CameraComponent,
  LayerCompoent,
  PositionComponent,
  RenderableComponent,
  ShapeComponent,
  SpriteComponent,
  TextComponent,
} from "../components";
import { System } from "../ecs";

export class RendererSystem extends System {
  componentsRequired = new Set<Function>([RenderableComponent]);

  render(entities: Set<number>, renderer: Renderer) {
    const sortedEntities = [...entities].sort((a, b) => {
      const containerA = this.ecs.getComponents(a);
      const containerB = this.ecs.getComponents(b);
      const zA = containerA.get(PositionComponent)?.z || 0;
      const zB = containerB.get(PositionComponent)?.z || 0;
      const layerA = containerA.get(LayerCompoent)?.layer || 0;
      const layerB = containerB.get(LayerCompoent)?.layer || 0;

      const orderA = 0.0 + layerA + zA / 1000;
      const orderB = 0.0 + layerB + zB / 1000;

      return orderA > orderB ? 1 : -1;
    });

    for (const entity of sortedEntities) {
      const container = this.ecs.getComponents(entity);
      const sprite = container.get(SpriteComponent);
      const shape = container.get(ShapeComponent);
      const text = container.get(TextComponent);
      const position = container.get(PositionComponent);
      const camera = container.get(CameraComponent);

      const xOffset = camera?.offsetX || 0;
      const yOffset = camera?.offsetY || 0;

      if (sprite && position) {
        renderer.drawImage({
          id: sprite.id,
          sx: sprite.sx,
          sy: sprite.sy,
          sw: sprite.w,
          sh: sprite.h,
          dx: position.x - xOffset,
          dy: position.y - yOffset,
          dw: sprite.dw,
          dh: sprite.dh,
          align: sprite.align,
        });
      }

      if (shape) {
        renderer.drawShape(shape);
      }

      if (text && position) {
        renderer.drawText({
          ...text.options,
          x: position.x,
          y: position.y,
        });
      }
    }
  }
}
