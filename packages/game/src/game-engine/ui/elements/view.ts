import { createComponent, createEntity, UIEntityElement } from "..";
import {
  LayerCompoent,
  PositionComponent,
  RenderableComponent,
  ScreenComponent,
  ShapeComponent,
  SizeComponent,
  SystemEventComponent,
  ViewComponent,
  ViewStyle,
} from "../../ecs";

interface IViewProps {
  style?: ViewStyle;
  children?: UIEntityElement[];
}

export function View(props: IViewProps) {
  return createEntity({
    components: [
      createComponent({
        type: ScreenComponent,
        params: [],
      }),
      createComponent({
        type: ViewComponent,
        params: [props.style],
      }),
      createComponent({
        type: ShapeComponent,
        params: [],
      }),
      createComponent({
        type: RenderableComponent,
        params: [],
      }),
      createComponent({
        type: LayerCompoent,
        params: [],
      }),
      createComponent({
        type: SizeComponent,
        params: [],
      }),
      createComponent({
        type: SystemEventComponent,
        params: [],
      }),
      createComponent({
        type: PositionComponent,
        params: [],
      }),
    ],
    children: props.children,
  });
}
