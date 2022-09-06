import {
  LayerCompoent,
  PointComponent,
  PositionComponent,
  ScreenComponent,
  ShapeComponent,
  SizeComponent,
  SpriteComponent,
  TextComponent,
  ViewComponent,
  ViewStyle,
} from "../components";
import { ChildrenComponent, Entity, ParentComponent, System } from "../ecs";

interface ViewBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export class ViewSystem extends System {
  componentsRequired = new Set<Function>([ViewComponent]);

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const tree = container.get(ViewComponent);
      const screen = container.get(ScreenComponent);
      const parent = container.get(ParentComponent);
      const layer = container.get(LayerCompoent);

      if (!tree || !screen || !layer) continue;
      if (parent) continue;

      const bounds = {
        xMin: 0,
        xMax: screen.x,
        yMin: 0,
        yMax: screen.y,
      };

      this.updateTree(layer.layer, bounds, tree.style, entity);
    }
  }

  updateTree(
    parentLayer: number,
    bounds: ViewBounds,
    style: ViewStyle = {},
    e: Entity
  ) {
    const container = this.ecs.getComponents(e);
    const view = container.get(ViewComponent);
    const shape = container.get(ShapeComponent);
    const children = container.get(ChildrenComponent);
    const position = container.get(PositionComponent);
    const layer = container.get(LayerCompoent)!;
    const size = container.get(SizeComponent);
    const text = container.get(TextComponent);
    const sprite = container.get(SpriteComponent);

    if (layer) {
      layer.layer = parentLayer + 0.00001;
    }

    if (view) {
      const nextBounds = this.getBounds(bounds, view.style);
      const border = view.style?.borderColor;
      const fill = view.style?.backgroundColor;
      const points = this.getPoints(nextBounds);

      if (size) {
        size.x = nextBounds.xMax - nextBounds.xMin;
        size.y = nextBounds.yMax - nextBounds.yMin;
      }

      if (shape) {
        shape.points = points;
        shape.border = border;
        shape.fill = fill;
      }

      if (children) {
        for (let i = 0; i < children.children.length; i++) {
          const child = children.children[i];
          this.updateTree(layer.layer, nextBounds, view.style, child);
        }
      }
    } else {
      if (!position) return;

      if (!size) {
        position.x = bounds.xMin;
        position.y = bounds.yMin;
        return;
      }

      const { alignItems, justifyContent } = style;
      const width = bounds.xMax - bounds.xMin;
      const height = bounds.yMax - bounds.yMin;

      switch (alignItems) {
        case "center": {
          position.y = bounds.yMin + (height - size.y) / 2;
          break;
        }
        case "end": {
          position.y = bounds.yMax - size.y;
          break;
        }
        default: {
          position.y = bounds.yMin;
          break;
        }
      }

      switch (justifyContent) {
        case "center": {
          position.x = bounds.xMin + (width - size.x) / 2;
          break;
        }
        case "end": {
          position.x = bounds.xMin - size.x;
          break;
        }
        default: {
          position.x = bounds.xMin;
          break;
        }
      }

      if (text) {
        const m = this.ecs.ge.platform.renderer.measureText(text.options);
        size.x = m.x;
        size.y = m.y;
      }

      if (sprite) {
        size.x = sprite.dw || sprite.w || 0;
        size.y = sprite.dh || sprite.h || 0;
      }
    }
  }

  getBounds(bounds: ViewBounds, style: ViewStyle = {}) {
    const nextBounds = { ...bounds };

    const { top, right, bottom, left, width, height } = style || {};

    if (top) {
      nextBounds.yMin += top;
    }

    if (left) {
      nextBounds.xMin += left;
    }

    if (bottom) {
      nextBounds.yMax -= bottom;
    }

    if (right) {
      nextBounds.xMax -= right;
    }

    if (height) {
      if (bottom && !top) {
        nextBounds.yMin = nextBounds.yMax - height;
      }

      if (top && !bottom) {
        nextBounds.yMax = nextBounds.yMin + height;
      }
    }

    if (width) {
      if (right && !left) {
        nextBounds.xMin = nextBounds.xMax - width;
      }

      if (left && !right) {
        nextBounds.xMax = nextBounds.xMin + width;
      }
    }

    return nextBounds;
  }

  getPoints(bounds: ViewBounds) {
    return [
      new PointComponent(bounds.xMin, bounds.yMin),
      new PointComponent(bounds.xMax, bounds.yMin),
      new PointComponent(bounds.xMax, bounds.yMax),
      new PointComponent(bounds.xMin, bounds.yMax),
    ];
  }
}
