import {
  CameraComponent,
  LayerCompoent,
  PositionComponent,
  RenderableComponent,
  SizeComponent,
  SpriteComponent,
} from "../components";
import { ECS, Entity } from "../ecs";

export interface ISpriteBundle<S extends string> {
  ecs: ECS;
  sprite: ConstructorParameters<typeof SpriteComponent<S>>;
  e?: Entity;
  position?: ConstructorParameters<typeof PositionComponent>;
  layer?: ConstructorParameters<typeof LayerCompoent>;
  camera?: boolean;
}

export function SpriteBundle<S extends string>({
  ecs,
  e: _e,
  sprite,
  position = [0, 0],
  layer = [0],
  camera,
}: ISpriteBundle<S>) {
  const e = _e || ecs.addEntity();
  ecs.addComponent(e, new SpriteComponent<S>(...sprite));
  ecs.addComponent(e, new PositionComponent(...position));
  ecs.addComponent(e, new LayerCompoent(...layer));
  ecs.addComponent(e, new SizeComponent(sprite[5], sprite[6]));
  ecs.addComponent(e, new RenderableComponent());
  if (camera) ecs.addComponent(e, new CameraComponent(0, 0));
  return e;
}
