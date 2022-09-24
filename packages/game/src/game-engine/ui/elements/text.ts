import { createComponent, createEntity } from "..";
import {
  LayerCompoent,
  PositionComponent,
  RenderableComponent,
  SizeComponent,
  TextComponent,
} from "../../ecs";

type ITextProps = ConstructorParameters<typeof TextComponent>[0];

export function Text(props: ITextProps) {
  return createEntity({
    components: [
      createComponent({
        type: TextComponent,
        params: [props],
        updates: {
          options: props,
        },
      }),
      createComponent({
        type: PositionComponent,
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
        type: RenderableComponent,
        params: [],
      }),
    ],
  });
}
