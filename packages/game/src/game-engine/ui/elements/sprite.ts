import { createComponent, createEntity } from "..";
import {
  CameraComponent,
  LayerCompoent,
  PositionComponent,
  RenderableComponent,
  SizeComponent,
  SpriteComponent,
} from "../../ecs";

export interface SpriteProps {
  sprite: {
    id?: string;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
    dw?: number;
    dh?: number;
    align?: "center" | "left";
  };
  position?: { x?: number; y?: number; z?: number };
  camera?: boolean;
}

export function Sprite(props: SpriteProps) {
  const { position = {}, sprite, camera } = props;
  const { id, sx, sy, sw, sh, dw, dh, align = "center" } = sprite;
  const { x = 0, y = 0, z = 0 } = position;

  return createEntity({
    components: [
      createComponent({
        type: SpriteComponent,
        params: [id, sx, sy, sw, sh, dw, dh, align],
        updates: sprite,
      }),
      createComponent({
        type: PositionComponent,
        params: [x, y, z],
        updates: position,
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
      ...(camera
        ? [
            createComponent({
              type: CameraComponent,
              params: [0, 0],
            }),
          ]
        : []),
    ],
  });
}
