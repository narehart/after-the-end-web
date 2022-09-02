import {
  AnimatedSpriteComponent,
  CameraComponent,
  LayerCompoent,
  PositionComponent,
} from "../components";
import { ECS, Entity } from "../ecs";

export interface IAnimatedSpriteBundle<S extends string> {
  ecs: ECS;
  e?: Entity;
  parent?: Entity;
  animation: ConstructorParameters<typeof AnimatedSpriteComponent<S>>;
  position?: ConstructorParameters<typeof PositionComponent>;
  layer?: ConstructorParameters<typeof LayerCompoent>;
  camera?: boolean;
}

export function AnimatedSpriteBundle<S extends string>({
  ecs,
  animation,
  e: _e,
  parent,
  position = [0, 0],
  layer = [0],
  camera,
}: IAnimatedSpriteBundle<S>) {
  const e = _e || ecs.addEntity(parent);
  ecs.addComponent(e, new AnimatedSpriteComponent(...animation));
  ecs.addComponent(e, new PositionComponent(...position));
  ecs.addComponent(e, new LayerCompoent(...layer));
  if (camera) ecs.addComponent(e, new CameraComponent(0, 0));
  return e;
}
