import {
  Component,
  ECS,
  Entity,
  LayerCompoent,
  PointComponent,
  System,
  SystemEventComponent,
} from "../game-engine";
import { Hex } from "../lib/hex-grid";
import {
  HEX_SIZE,
  MAP_SIZE,
  MAP_CONTROLS_ARROW_PAN_VELOCITY,
  MAP_PADDING,
} from "../data/settings";
import { HexGrid } from "../lib/hex-grid";
import { Sprites } from "../data/sprites";
import { PositionComponent } from "../game-engine/ecs/components/position";
import { SpriteComponent } from "../game-engine/ecs/components/sprite";
import { clamp } from "../game-engine/utils/utils";
import { HexTerrain } from "../lib/hex-terrain";
import { AnimatedSpriteComponent } from "../game-engine/ecs/components/animated-sprite";

const hexGrid = new HexGrid(HEX_SIZE, MAP_PADDING);
hexGrid.rectangle(MAP_SIZE);
const terrain = new HexTerrain(hexGrid);
terrain.generate();

class MapBackgroundManagerComponent extends Component {}
class MapBackgroundComponent extends Component {}

class ScreenComponent extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

class SceneSizeComponent extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

class CameraManagerComponent extends Component {}
export class CameraComponent extends Component {
  constructor(
    public x: number,
    public y: number,
    public offsetX: number = 0,
    public offsetY: number = 0
  ) {
    super();
  }
}

class HexGridManagerComponent extends Component {}
class HexComponent extends Component {
  constructor(public hex: Hex) {
    super();
  }
}

interface ISpriteBundle {
  ecs: ECS;
  sprite: ConstructorParameters<typeof SpriteComponent<Sprites>>;
  e?: Entity;
  position?: ConstructorParameters<typeof PositionComponent>;
  layer?: ConstructorParameters<typeof LayerCompoent>;
  camera?: boolean;
}

function SpriteBundle({
  ecs,
  e: _e,
  sprite,
  position = [0, 0],
  layer = [0],
  camera,
}: ISpriteBundle) {
  const e = _e || ecs.addEntity();
  ecs.addComponent(e, new SpriteComponent<Sprites>(...sprite));
  ecs.addComponent(e, new PositionComponent(...position));
  ecs.addComponent(e, new LayerCompoent(...layer));
  if (camera) ecs.addComponent(e, new CameraComponent(0, 0));
  return e;
}

interface IAnimatedSpriteBundle {
  ecs: ECS;
  e?: Entity;
  parent?: Entity;
  animation: ConstructorParameters<typeof AnimatedSpriteComponent<Sprites>>;
  position?: ConstructorParameters<typeof PositionComponent>;
  layer?: ConstructorParameters<typeof LayerCompoent>;
  camera?: boolean;
}

function AnimatedSpriteBundle({
  ecs,
  animation,
  e: _e,
  parent,
  position = [0, 0],
  layer = [0],
  camera,
}: IAnimatedSpriteBundle) {
  const e = _e || ecs.addEntity(parent);
  ecs.addComponent(e, new AnimatedSpriteComponent(...animation));
  ecs.addComponent(e, new PositionComponent(...position));
  ecs.addComponent(e, new LayerCompoent(...layer));
  if (camera) ecs.addComponent(e, new CameraComponent(0, 0));
  return e;
}

export class ScreenSystem extends System {
  componentsRequired = new Set<Function>([ScreenComponent]);

  init() {
    const screenEntity = this.ecs.addEntity();
    this.ecs.addComponent(screenEntity, new ScreenComponent(0, 0));
  }

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const screen = container.get(ScreenComponent);

      if (!screen) return;

      screen.x = this.ecs.ge.platform.viewport.x;
      screen.y = this.ecs.ge.platform.viewport.y;
    }
  }
}

export class SceneSizeSystem extends System {
  componentsRequired = new Set<Function>([SceneSizeComponent]);

  init() {
    const sceneEntity = this.ecs.addEntity();
    this.ecs.addComponent(sceneEntity, new SceneSizeComponent(0, 0));
  }

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const sceneSize = container.get(SceneSizeComponent);

      if (!sceneSize) return;

      sceneSize.x = hexGrid.pointSize.x;
      sceneSize.y = hexGrid.pointSize.y;
    }
  }
}

export class CameraManagerSystem extends System {
  componentsRequired = new Set<Function>([CameraManagerComponent]);

  init() {
    const cameraEntity = this.ecs.addEntity();
    this.ecs.addComponent(cameraEntity, new CameraManagerComponent());
    this.ecs.addComponent(cameraEntity, new CameraComponent(0, 0));
    this.ecs.addComponent(cameraEntity, new ScreenComponent(0, 0));
    this.ecs.addComponent(cameraEntity, new SceneSizeComponent(0, 0));
    this.ecs.addComponent(cameraEntity, new SystemEventComponent());
  }

  update(entities: Set<Entity>) {
    // update camera based on user input
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const camera = container.get(CameraComponent);
      const screen = container.get(ScreenComponent);
      const scene = container.get(SceneSizeComponent);
      const events = container.get(SystemEventComponent);

      const keys = events?.events.keyboard.keys;

      if (!camera || !screen || !scene || !keys) continue;

      if (keys.includes("ARROW_RIGHT")) {
        camera.x += MAP_CONTROLS_ARROW_PAN_VELOCITY;
      }
      if (keys.includes("ARROW_LEFT")) {
        camera.x -= MAP_CONTROLS_ARROW_PAN_VELOCITY;
      }
      if (keys.includes("ARROW_UP")) {
        camera.y -= MAP_CONTROLS_ARROW_PAN_VELOCITY;
      }
      if (keys.includes("ARROW_DOWN")) {
        camera.y += MAP_CONTROLS_ARROW_PAN_VELOCITY;
      }

      break;
    }

    // constrain camera bounds
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const screen = container.get(ScreenComponent);
      const scene = container.get(SceneSizeComponent);
      const camera = container.get(CameraComponent);

      if (!camera || !screen || !scene) continue;
      if (screen.x === 0 || screen.y === 0) continue;

      const xMin = screen.x / 2;
      const xMax = scene.x - xMin;
      const yMin = screen.y / 2;
      const yMax = scene.y - yMin;

      if (scene.x <= screen.x) {
        camera.x = xMin;
        camera.offsetX = 0;
      }

      if (scene.y <= screen.y) {
        camera.y = yMin;
        camera.offsetY = 0;
      }

      camera.x = Math.floor(clamp(camera.x, xMin, xMax));
      camera.y = Math.floor(clamp(camera.y, yMin, yMax));
      camera.offsetX = Math.floor(Math.max(0, camera.x - screen.x / 2));
      camera.offsetY = Math.floor(Math.max(0, camera.y - screen.y / 2));

      break;
    }
  }
}

export class CameraUpdateSystem extends System {
  componentsRequired = new Set<Function>([CameraComponent]);

  update(entities: Set<Entity>) {
    let nextCamera;

    // get the updated data from the manager
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const manager = container.get(CameraManagerComponent);
      const camera = container.get(CameraComponent);
      const screen = container.get(ScreenComponent);

      if (!manager || !camera || !screen) continue;

      nextCamera = camera;

      break;
    }

    if (!nextCamera) return;

    // update all camera entities with the new data
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const camera = container.get(CameraComponent);

      if (!camera) continue;

      camera.x = nextCamera.x;
      camera.y = nextCamera.y;
      camera.offsetX = nextCamera.offsetX;
      camera.offsetY = nextCamera.offsetY;
    }
  }
}

export class MapBackgroundSystem extends System {
  private spriteKey: Sprites = "map-background";

  componentsRequired = new Set<Function>([MapBackgroundComponent]);

  init() {
    const e = this.ecs.addEntity();
    this.ecs.addComponent(e, new MapBackgroundComponent());
    this.ecs.addComponent(e, new MapBackgroundManagerComponent());
    this.ecs.addComponent(e, new ScreenComponent(0, 0));
  }

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const mapBackgroundManager = container.get(MapBackgroundManagerComponent);

      if (mapBackgroundManager) continue;

      this.ecs.removeEntity(entity);
    }

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const mapBackgroundManager = container.get(MapBackgroundManagerComponent);
      const screen = container.get(ScreenComponent);

      if (!mapBackgroundManager || !screen) continue;

      const spriteInfo = this.ecs.ge.platform.renderer.assets[this.spriteKey];
      const columns = Math.ceil(screen.x / spriteInfo.size.x);
      const rows = Math.ceil(screen.y / spriteInfo.size.y);

      for (let i = 0; i <= columns; i++) {
        const x = i * spriteInfo.size.x + spriteInfo.size.x / 2;
        for (let j = 0; j <= rows; j++) {
          const y = j * spriteInfo.size.y + spriteInfo.size.y / 2;
          this.addMapBacgroundEntity(x, y);
        }
      }
    }
  }

  addMapBacgroundEntity(x: PositionComponent["x"], y: PositionComponent["y"]) {
    const e = this.ecs.addEntity();

    this.ecs.addComponent(e, new MapBackgroundComponent());

    SpriteBundle({
      ecs: this.ecs,
      e,
      sprite: [this.spriteKey],
      position: [x, y],
    });
  }
}

export class HexGridGenerateSystem extends System {
  componentsRequired = new Set<Function>([HexComponent]);
  initialized = false;

  init() {
    const hexEntity = this.ecs.addEntity();
    this.ecs.addComponent(hexEntity, new HexGridManagerComponent());
    this.ecs.addComponent(hexEntity, new HexComponent(new Hex(0, 0, 0)));
    this.ecs.addComponent(hexEntity, new SystemEventComponent());
    this.ecs.addComponent(hexEntity, new CameraComponent(0, 0));
    this.ecs.addComponent(hexEntity, new PositionComponent(0, 0));
    this.ecs.addComponent(hexEntity, new ScreenComponent(0, 0));
  }

  update(entities: Set<Entity>) {
    let areaHexes: number[] = [];

    // update hex data
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const hexManager = container.get(HexGridManagerComponent);
      const camera = container.get(CameraComponent);
      const screen = container.get(ScreenComponent);

      if (!hexManager || !camera || !screen || !camera) return;

      const startX = camera.x - screen.x / 2;
      const startY = camera.y - screen.y / 2;

      areaHexes = hexGrid.hexesInArea(
        new PointComponent(startX, startY),
        screen.x,
        screen.y
      );

      break;
    }

    // update existing hexes
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const hexManager = container.get(HexGridManagerComponent);
      const hex = container.get(HexComponent);
      const position = container.get(PositionComponent);

      if (hexManager) continue;
      if (!hex || !position) continue;

      const index = hexGrid.toIndex(hex.hex);
      const areaIndex = areaHexes.indexOf(index);
      const inArea = areaIndex !== -1;

      if (inArea) {
        areaHexes.splice(areaIndex, 1);
      } else {
        this.ecs.removeEntity(entity);
      }
    }

    // add new hexes
    for (const hex of areaHexes) {
      this.addHexEntity(hexGrid.grid[hex]);
    }
  }

  getHexPosition(hex: Hex) {
    const index = hexGrid.toIndex(hex);
    const offset = terrain.terrainOrder[index] || 0;
    const point = hexGrid.layout.toPoint(hex);
    const x = point.x;
    const y = point.y - offset;
    const z = y;
    return { x, y, z };
  }

  addHexEntity(hex: Hex) {
    const e = this.ecs.addEntity();
    const index = hexGrid.toIndex(hex);
    const sprite = terrain.terrainSprites[index] || "hex-plains-001";

    this.ecs.addComponent(e, new HexComponent(hex));

    const { x, y, z } = this.getHexPosition(hex);

    SpriteBundle({
      ecs: this.ecs,
      e,
      sprite: [sprite],
      position: [x, y, z],
      layer: [1],
      camera: true,
    });

    if (sprite === "hex-water-001") {
      AnimatedSpriteBundle({
        ecs: this.ecs,
        parent: e,
        animation: ["hex-animations-water-001", 50, 1, true],
        position: [x, y, z + 0.01],
        layer: [1],
        camera: true,
      });
    }

    return e;
  }
}
