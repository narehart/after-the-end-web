import {
  CameraComponent,
  LayerCompoent,
  PositionComponent,
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
  if (camera) ecs.addComponent(e, new CameraComponent(0, 0));
  return e;
}
