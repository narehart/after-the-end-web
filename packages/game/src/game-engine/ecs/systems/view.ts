import {
  PointComponent,
  PositionComponent,
  ScreenComponent,
  ShapeComponent,
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

      if (!tree || !screen) continue;
      if (parent) continue;

      const bounds = {
        xMin: 0,
        xMax: screen.x,
        yMin: 0,
        yMax: screen.y,
      };

      this.updateTree(bounds, entity);
    }
  }

  updateTree(bounds: ViewBounds, entity: Entity) {
    const container = this.ecs.getComponents(entity);
    const view = container.get(ViewComponent);
    const shape = container.get(ShapeComponent);
    const children = container.get(ChildrenComponent);
    const position = container.get(PositionComponent);

    if (view) {
      const nextBounds = this.getBounds(bounds, view.style);
      const border = view.style?.borderColor;
      const fill = view.style?.backgroundColor;
      const points = this.getPoints(nextBounds);

      if (shape) {
        shape.points = points;
        shape.border = border;
        shape.fill = fill;
      }

      if (children) {
        for (let i = 0; i < children.children.length; i++) {
          const child = children.children[i];
          this.updateTree(nextBounds, child);
        }
      }
    } else {
      if (!position) return;

      position.x = bounds.xMin;
      position.y = bounds.yMin;
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
