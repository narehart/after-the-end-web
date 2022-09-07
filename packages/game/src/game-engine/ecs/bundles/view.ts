import {
  LayerCompoent,
  PositionComponent,
  RenderableComponent,
  ScreenComponent,
  ShapeComponent,
  SizeComponent,
  SystemEventComponent,
} from "../components";
import { ViewComponent, ViewStyle } from "../components/view";
import { ChildrenComponent, ECS, Entity, ParentComponent } from "../ecs";

interface IViewBundle {
  children?: Entity[];
  ecs: ECS;
  id: string;
  layer?: number;
  style?: ViewStyle;
}

export function ViewBundle({ ecs, id, style, children, layer }: IViewBundle) {
  const e = ecs.addEntity();
  ecs.addComponent(e, new ScreenComponent());
  ecs.addComponent(e, new ViewComponent(id, style));
  ecs.addComponent(e, new ShapeComponent());
  ecs.addComponent(e, new RenderableComponent());
  ecs.addComponent(e, new ChildrenComponent(children));
  ecs.addComponent(e, new LayerCompoent(layer));
  ecs.addComponent(e, new SizeComponent());
  ecs.addComponent(e, new SystemEventComponent());
  ecs.addComponent(e, new PositionComponent());

  if (children?.length) {
    for (let i = 0; i < children.length; i++) {
      const childE = children[i];
      const container = ecs.getComponents(childE);
      const childLayer = container.get(LayerCompoent);

      ecs.addComponent(children[i], new ParentComponent(e));
      if (layer && childLayer) childLayer.layer = layer;
    }
  }

  return e;
}
