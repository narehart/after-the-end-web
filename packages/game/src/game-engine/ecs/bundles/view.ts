import {
  LayerCompoent,
  RenderableComponent,
  ScreenComponent,
  ShapeComponent,
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
