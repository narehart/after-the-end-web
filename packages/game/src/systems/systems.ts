import {
  CameraComponent,
  Component,
  Entity,
  PointComponent,
  ScreenComponent,
  System,
  SystemEventComponent,
  PositionComponent,
  SpriteBundle,
  AnimatedSpriteBundle,
  NullComponent,
  SceneManagerComponent,
  SceneComponent,
  CameraManagerComponent,
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
import { HexTerrain } from "../lib/hex-terrain";
import { hexCursor, hexData } from "../data/hex";

const hexGrid = new HexGrid(HEX_SIZE, MAP_PADDING);
hexGrid.rectangle(MAP_SIZE);
const terrain = new HexTerrain(hexGrid);
terrain.generate();

class MapBackgroundManagerComponent extends Component {}
class MapBackgroundComponent extends Component {}

class HexGridManagerComponent extends Component {}
class HexComponent extends Component {
  constructor(public hex: Hex = new Hex(0, 0, 0)) {
    super();
  }
}

function getHexPosition(hex: Hex) {
  const index = hexGrid.toIndex(hex);
  const hexType = terrain.hexType[index];
  const offset = hexData[hexType].sprite.offset || 0;
  const point = hexGrid.layout.toPoint(hex);
  const x = point.x;
  const y = point.y - offset;
  const z = y;
  return { x, y, z };
}

export class SetupSystem extends System {
  componentsRequired = new Set<Function>([NullComponent]);

  init() {
    const sceneE = this.ecs.addEntity();
    this.ecs.addComponent(sceneE, new SceneComponent());
    this.ecs.addComponent(sceneE, new SceneManagerComponent(hexGrid.pointSize));

    const cameraE = this.ecs.addEntity();
    this.ecs.addComponent(
      cameraE,
      new CameraManagerComponent(MAP_CONTROLS_ARROW_PAN_VELOCITY)
    );
    this.ecs.addComponent(cameraE, new CameraComponent());
    this.ecs.addComponent(cameraE, new ScreenComponent());
    this.ecs.addComponent(cameraE, new SceneComponent());
    this.ecs.addComponent(cameraE, new SystemEventComponent());
  }
}

export class MapBackgroundSystem extends System {
  private spriteKey: Sprites = "map-background";

  componentsRequired = new Set<Function>([MapBackgroundComponent]);

  init() {
    const e = this.ecs.addEntity();
    this.ecs.addComponent(e, new MapBackgroundComponent());
    this.ecs.addComponent(e, new MapBackgroundManagerComponent());
    this.ecs.addComponent(e, new ScreenComponent());
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

    SpriteBundle<Sprites>({
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
    this.ecs.addComponent(hexEntity, new HexComponent());
    this.ecs.addComponent(hexEntity, new SystemEventComponent());
    this.ecs.addComponent(hexEntity, new CameraComponent());
    this.ecs.addComponent(hexEntity, new PositionComponent());
    this.ecs.addComponent(hexEntity, new ScreenComponent());
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

  addHexEntity(hex: Hex) {
    const e = this.ecs.addEntity();
    const index = hexGrid.toIndex(hex);
    const hexType = terrain.hexType[index] || "plains";
    const sprite = hexData[hexType].sprite;

    this.ecs.addComponent(e, new HexComponent(hex));

    const { x, y, z } = getHexPosition(hex);

    SpriteBundle<Sprites>({
      ecs: this.ecs,
      e,
      sprite: [sprite.id],
      position: [x, y, z],
      layer: [1],
      camera: true,
    });

    if (!sprite.animation) return;

    AnimatedSpriteBundle<Sprites>({
      ecs: this.ecs,
      parent: e,
      animation: sprite.animation,
      position: [x, y, z + 0.01],
      layer: [1],
      camera: true,
    });
  }
}

class HexCursorManagerComponent extends Component {}
class HexCursorComponent extends Component {}

export class HexCursorSystem extends System {
  componentsRequired = new Set<Function>([HexCursorComponent]);

  init() {
    const managerE = this.ecs.addEntity();
    this.ecs.addComponent(managerE, new HexCursorComponent());
    this.ecs.addComponent(managerE, new HexCursorManagerComponent());
    this.ecs.addComponent(managerE, new SystemEventComponent());
    this.ecs.addComponent(managerE, new CameraComponent());

    const cursorE = this.ecs.addEntity();
    this.ecs.addComponent(cursorE, new HexCursorComponent());
  }

  update(entities: Set<Entity>) {
    let camera;
    let mouse;

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const manager = container.get(HexCursorManagerComponent);
      const events = container.get(SystemEventComponent);

      if (!manager || !events) continue;

      camera = container.get(CameraComponent);
      mouse = events?.events.mouse.mousemove;

      if (camera) break;
    }

    if (!camera || !mouse) return;

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const manager = container.get(HexCursorManagerComponent);
      const position = container.get(PositionComponent);

      if (manager) continue;

      const maybeHex = hexGrid.layout.toHex(
        new PointComponent(mouse.x + camera.offsetX, mouse.y + camera.offsetY)
      );
      const index = hexGrid.toIndex(maybeHex);

      if (index === -1) continue;

      const hex = hexGrid.grid[index];

      if (!hex) continue;

      const { x, y, z } = getHexPosition(hex);

      if (!position) {
        SpriteBundle({
          ecs: this.ecs,
          e: entity,
          sprite: [hexCursor.default.sprite.id],
          position: [x, y, z],
          layer: [2],
          camera: true,
        });
      } else {
        position.x = x;
        position.y = y;
        position.z = z;
      }
    }
  }
}
