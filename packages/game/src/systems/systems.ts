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
  TextBundle,
  ViewBundle,
  SpriteComponent,
  TextComponent,
} from "../game-engine";
import { Hex, HexGrid } from "../lib/hex-grid";
import { HexTerrain } from "../lib/hex-terrain";
import {
  HEX_SIZE,
  MAP_SIZE,
  MAP_CONTROLS_ARROW_PAN_VELOCITY,
  MAP_PADDING,
} from "../data/settings";
import { Sprites } from "../data/sprites";
import { hexCursor, hexData } from "../data/hex";

const LAYERS = {
  map: 1,
  cursor: 2,
  ui: 3,
};

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
  const z = y / 1000;
  return { x, y, z };
}

export class SetupSystem extends System {
  componentsRequired = new Set<Function>([NullComponent]);

  init() {
    this.setupScene();
    this.setupCamera();
  }

  setupScene() {
    const sceneE = this.ecs.addEntity();
    this.ecs.addComponent(sceneE, new SceneComponent());
    this.ecs.addComponent(sceneE, new SceneManagerComponent(hexGrid.pointSize));
  }

  setupCamera() {
    const cameraE = this.ecs.addEntity();
    this.ecs.addComponent(
      cameraE,
      new CameraManagerComponent(MAP_CONTROLS_ARROW_PAN_VELOCITY)
    );
    this.ecs.addComponent(cameraE, new CameraComponent());
    this.ecs.addComponent(cameraE, new ScreenComponent());
    this.ecs.addComponent(cameraE, new SceneComponent());
    this.ecs.addComponent(cameraE, new SystemEventComponent());
    this.ecs.addComponent(cameraE, new PositionComponent());
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
      layer: [LAYERS.map],
      camera: true,
    });

    if (!sprite.animation) return;

    AnimatedSpriteBundle<Sprites>({
      ecs: this.ecs,
      parent: e,
      animation: sprite.animation,
      position: [x, y, z + 0.01],
      layer: [LAYERS.map],
      camera: true,
    });
  }
}

class HexSelectManagerComponent extends Component {}

class HexSelectComponent extends Component {
  constructor(public index: number = 0) {
    super();
  }
}

export class HexSelectSystem extends System {
  componentsRequired = new Set<Function>([HexSelectComponent]);
  private selectedIndex = 0;

  init() {
    const e = this.ecs.addEntity();
    this.ecs.addComponent(e, new HexSelectManagerComponent());
    this.ecs.addComponent(e, new HexSelectComponent());
    this.ecs.addComponent(e, new SystemEventComponent());
    this.ecs.addComponent(e, new CameraComponent());
  }

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const manager = container.get(HexSelectManagerComponent);
      const events = container.get(SystemEventComponent);
      const camera = container.get(CameraComponent);

      if (!manager || !events || !camera) continue;

      const position = events?.events?.mouse?.mousemove;

      if (!position) continue;

      const maybeHex = hexGrid.layout.toHex(
        new PointComponent(
          position.x + camera.offsetX,
          position.y + camera.offsetY
        )
      );
      const index = hexGrid.toIndex(maybeHex);

      if (index === -1) continue;

      const hex = hexGrid.grid[index];

      if (!hex) continue;

      this.selectedIndex = index;

      break;
    }

    if (this.selectedIndex === undefined) return;

    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const selected = container.get(HexSelectComponent)!;
      selected.index = this.selectedIndex;
    }
  }
}

class HexCursorComponent extends Component {}

export class HexCursorSystem extends System {
  componentsRequired = new Set<Function>([HexCursorComponent]);

  init() {
    const e = this.ecs.addEntity();
    this.ecs.addComponent(e, new HexSelectComponent());
    this.ecs.addComponent(e, new HexCursorComponent());
  }

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const position = container.get(PositionComponent);
      const selected = container.get(HexSelectComponent);

      if (!selected) continue;

      const { x, y: hexY, z } = getHexPosition(hexGrid.grid[selected.index]);
      const y = hexY - hexCursor.default.sprite.offset;

      if (!position) {
        SpriteBundle({
          ecs: this.ecs,
          e: entity,
          sprite: [hexCursor.default.sprite.id],
          position: [x, y, z],
          layer: [LAYERS.cursor],
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

export class HexInfoDisplaySystem extends System {
  componentsRequired = new Set<Function>([HexSelectComponent]);
  private sprite = hexData.dominatingPeak.sprite.id;
  private hexName = "Dominating Peak";
  private hexDescription = "No special effect.";

  private spriteEntity: number = 0;
  private titleEntity: number = 0;

  init() {
    this.spriteEntity = SpriteBundle({
      ecs: this.ecs,
      sprite: [this.sprite, 0, 0, 50, 70, 25, 35, "left"],
    });

    this.titleEntity = TextBundle({
      ecs: this.ecs,
      text: [
        {
          text: this.hexName,
          fontFamily: "PixelFont",
          fontSize: 8,
        },
      ],
    });

    ViewBundle({
      ecs: this.ecs,
      id: "root",
      layer: LAYERS.ui,
      style: {
        borderColor: "#4b5360",
        borderStyle: "solid",
        borderWidth: "1px",
        backgroundColor: "#0d0d11",
        height: 50,
        width: 200,
        bottom: 20,
        right: 20,
      },
      children: [
        ViewBundle({
          ecs: this.ecs,
          id: "icon",
          style: {
            borderColor: "#4b5360",
            justifyContent: "center",
            borderWidth: "1px",
            height: 40,
            width: 40,
            left: 5,
            top: 5,
          },
          children: [this.spriteEntity],
        }),
        ViewBundle({
          ecs: this.ecs,
          id: "hex-name",
          style: {
            height: 10,
            left: 50,
            top: 5,
            right: 12,
          },
          children: [this.titleEntity],
        }),
        ViewBundle({
          ecs: this.ecs,
          id: "hex-description",
          style: {
            height: 20,
            left: 50,
            top: 18,
            right: 12,
          },
          children: [
            TextBundle({
              ecs: this.ecs,
              text: [
                {
                  text: this.hexDescription,
                  color: "#979797",
                  fontFamily: "PixelFont",
                  fontSize: 8,
                },
              ],
            }),
          ],
        }),
      ],
    });
  }

  update(entities: Set<Entity>) {
    for (const entity of entities) {
      const container = this.ecs.getComponents(entity);
      const selected = container.get(HexSelectComponent);

      if (!selected) continue;

      const hex = hexGrid.grid[selected.index];
      const index = hexGrid.toIndex(hex);
      const hexType = terrain.hexType[index];
      const data = hexData[hexType];

      this.updateSprite(this.spriteEntity, data.sprite.id);
      this.updateTitle(this.titleEntity, data.name);
    }
  }

  updateSprite(entity: Entity, id: Sprites) {
    const container = this.ecs.getComponents(entity);
    const sprite = container.get(SpriteComponent)!;
    sprite.id = id;
  }

  updateTitle(entity: Entity, title: string) {
    const container = this.ecs.getComponents(entity);
    const text = container.get(TextComponent)!;
    text.options.text = title;
  }
}
