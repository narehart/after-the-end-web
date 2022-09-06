import {
  LayerCompoent,
  PositionComponent,
  RenderableComponent,
} from "../components";
import { TextComponent } from "../components/text";
import { ECS } from "../ecs";

interface ITextBundle {
  ecs: ECS;
  text: ConstructorParameters<typeof TextComponent>;
  position?: ConstructorParameters<typeof PositionComponent>;
}

export function TextBundle({ ecs, text }: ITextBundle) {
  const e = ecs.addEntity();
  ecs.addComponent(e, new TextComponent(...text));
  ecs.addComponent(e, new PositionComponent());
  ecs.addComponent(e, new LayerCompoent());
  ecs.addComponent(e, new RenderableComponent());
  return e;
}
