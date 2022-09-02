import { SPRITES } from "../data/sprites";
import {
  AnimatedSpriteSystem,
  Scene,
  SystemEventSystem,
  RendererSystem,
  ScreenSystem,
} from "../game-engine";
import {
  CameraManagerSystem,
  CameraUpdateSystem,
  HexGridGenerateSystem,
  MapBackgroundSystem,
  SceneSizeSystem,
} from "../systems/systems";

export class WorldMap extends Scene {
  async init() {
    this.ecs.ge.platform.renderer.addImages(SPRITES);

    this.ecs.addSystem(new ScreenSystem());
    this.ecs.addSystem(new SystemEventSystem());
    this.ecs.addSystem(new SceneSizeSystem());
    this.ecs.addSystem(new CameraManagerSystem());
    this.ecs.addSystem(new MapBackgroundSystem());
    this.ecs.addSystem(new HexGridGenerateSystem());
    this.ecs.addSystem(new AnimatedSpriteSystem());
    this.ecs.addSystem(new CameraUpdateSystem());
    this.ecs.addSystem(new RendererSystem());
  }
}
