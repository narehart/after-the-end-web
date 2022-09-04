import { SPRITES } from "../data/sprites";
import {
  AnimatedSpriteSystem,
  CameraManagerSystem,
  CameraUpdateSystem,
  RendererSystem,
  Scene,
  SceneSystem,
  ScreenSystem,
  SystemEventSystem,
} from "../game-engine";
import {
  HexCursorSystem,
  HexGridGenerateSystem,
  MapBackgroundSystem,
  SetupSystem,
} from "../systems/systems";

export class WorldMap extends Scene {
  async init() {
    this.ecs.ge.platform.renderer.addImages(SPRITES);

    this.ecs.addSystem(new SetupSystem());
    this.ecs.addSystem(new ScreenSystem());
    this.ecs.addSystem(new SystemEventSystem());
    this.ecs.addSystem(new SceneSystem());
    this.ecs.addSystem(new CameraManagerSystem());
    this.ecs.addSystem(new MapBackgroundSystem());
    this.ecs.addSystem(new HexGridGenerateSystem());
    this.ecs.addSystem(new HexCursorSystem());
    this.ecs.addSystem(new AnimatedSpriteSystem());
    this.ecs.addSystem(new CameraUpdateSystem());
    this.ecs.addSystem(new RendererSystem());
  }
}
