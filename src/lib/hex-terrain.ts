import { Sprites } from "../data/sprites";
import { getRandomInt, shuffle, prng } from "../game-engine/utils/rng";
import { Hex, HexGrid, Layout } from "./hex-grid";

type PrimaryTerrain =
  | "water"
  | "swamp"
  | "desert"
  | "plains"
  | "hills"
  | "forest"
  | "mountains";
type FlavorTerrain =
  | "forestLight"
  | "forestHeavy"
  | "forestHills"
  | "forestMountains"
  | "dominatingPeak"
  | "desertHillsRocky"
  | "plainsCanyon"
  | "plainsFissure"
  | "dominatingPeak"
  | "desertMountains";
type Terrain = PrimaryTerrain | FlavorTerrain;
type Subhex = { whole: Hex[]; half: Hex[] };
type AtlusHex = Subhex & { center: Hex };

const terrainSprites: { [key in Terrain]?: Sprites } = {
  water: "hex-water-001",
  swamp: "hex-swamp-003",
  desert: "hex-desert-002",
  plains: "hex-plains-006",
  forest: "hex-forest-003",
  forestHeavy: "hex-forest-heavy-002",
  forestLight: "hex-forest-light-002",
  mountains: "hex-mountains-003",
  hills: "hex-hills-004",
  desertHillsRocky: "hex-desert-hills-001",
  forestHills: "hex-forest-hills-002",
  forestMountains: "hex-forest-mountains-002",
  dominatingPeak: "hex-dominating-peak-002",
  desertMountains: "hex-desert-mountains-001",
};

const terrainOrder: { [key in Terrain]?: number } = {
  water: -6,
  swamp: 0,
  desert: 0,
  plains: 0,
  forest: 0,
  forestHeavy: 0,
  forestLight: 0,
  mountains: 0,
  hills: 0,
  desertHillsRocky: 0,
  forestHills: 0,
  forestMountains: 0,
};

const assignmentTable: {
  [key in PrimaryTerrain]?: {
    primary: { type: Terrain; chance: number }[];
    secondary: { type: Terrain; chance: number }[];
    tertiary: { type: Terrain; chance: number }[];
    wildcard: { type: Terrain; chance: number }[];
  };
} = {
  water: {
    primary: [{ type: "water", chance: 100 }],
    secondary: [{ type: "plains", chance: 100 }],
    tertiary: [
      { type: "forest", chance: 34 },
      { type: "forestLight", chance: 66 },
    ],
    wildcard: [
      { type: "swamp", chance: 33 },
      { type: "plains", chance: 33 },
      { type: "hills", chance: 33 },
    ],
  },
  swamp: {
    primary: [{ type: "swamp", chance: 100 }],
    secondary: [{ type: "plains", chance: 100 }],
    tertiary: [{ type: "forest", chance: 100 }],
    wildcard: [{ type: "water", chance: 100 }],
  },
  desert: {
    primary: [{ type: "desert", chance: 100 }],
    secondary: [
      { type: "desertHillsRocky", chance: 34 },
      { type: "desert", chance: 66 },
    ],
    tertiary: [{ type: "plains", chance: 100 }],
    wildcard: [
      { type: "water", chance: 50 },
      { type: "desertMountains", chance: 50 },
    ],
  },
  plains: {
    primary: [{ type: "plains", chance: 100 }],
    secondary: [{ type: "forest", chance: 100 }],
    tertiary: [{ type: "hills", chance: 100 }],
    wildcard: [
      { type: "water", chance: 33 },
      { type: "swamp", chance: 33 },
      { type: "plains", chance: 33 },
    ],
  },
  forest: {
    primary: [
      { type: "forest", chance: 66 },
      { type: "forestHeavy", chance: 34 },
    ],
    secondary: [{ type: "plains", chance: 100 }],
    tertiary: [
      { type: "forestHills", chance: 66 },
      { type: "hills", chance: 34 },
    ],
    wildcard: [
      { type: "water", chance: 33 },
      { type: "swamp", chance: 33 },
      { type: "forestMountains", chance: 22 },
      { type: "mountains", chance: 11 },
    ],
  },
  hills: {
    primary: [
      { type: "hills", chance: 66 },
      { type: "forestHills", chance: 34 },
    ],
    secondary: [
      { type: "mountains", chance: 80 },
      { type: "plains", chance: 20 },
    ],
    tertiary: [{ type: "plains", chance: 100 }],
    wildcard: [
      { type: "water", chance: 33 },
      { type: "swamp", chance: 33 },
      { type: "mountains", chance: 24 },
      { type: "hills", chance: 9 },
    ],
  },
  mountains: {
    primary: [
      { type: "mountains", chance: 80 },
      { type: "dominatingPeak", chance: 20 },
    ],
    secondary: [{ type: "hills", chance: 100 }],
    tertiary: [
      { type: "forest", chance: 66 },
      { type: "forestMountains", chance: 34 },
    ],
    wildcard: [{ type: "swamp", chance: 100 }],
  },
};

export class HexTerrain {
  private static subhexesFlat: Subhex = {
    whole: [
      new Hex(-2, 0, 2),
      new Hex(-2, 1, 1),
      new Hex(-2, 2, 0),
      new Hex(-1, -1, 2),
      new Hex(-1, 0, 1),
      new Hex(-1, 1, 0),
      new Hex(-1, 2, -1),
      new Hex(0, -2, 2),
      new Hex(0, -1, 1),
      new Hex(0, 1, -1),
      new Hex(0, 2, -2),
      new Hex(1, -2, 1),
      new Hex(1, -1, 0),
      new Hex(1, 0, -1),
      new Hex(1, 1, -2),
      new Hex(2, -2, 0),
      new Hex(2, -1, -1),
      new Hex(2, 0, -2),
    ],
    half: [
      new Hex(-3, 1, 2),
      new Hex(-3, 2, 1),
      new Hex(-2, -1, 3),
      new Hex(-2, 3, -1),
      new Hex(-1, -2, 3),
      new Hex(-1, 3, -2),
      new Hex(1, -3, 2),
      new Hex(1, 2, -3),
      new Hex(2, -3, 1),
      new Hex(2, 1, -3),
      new Hex(3, -2, -1),
      new Hex(3, -1, -2),
    ],
  };

  private atlusWidth = 7;
  private atlusHeight = 6;

  public centerHexes: Hex[] = [];
  public atlusHexes: AtlusHex[] = [];
  public terrainSprites: Sprites[] = [];
  public terrainOrder: number[] = [];

  constructor(private hexGrid: HexGrid) {}

  public generate() {
    // get all the atlus hex centers
    this.centerHexes = this.getCenters();
    this.atlusHexes = this.getAtluses(this.centerHexes);

    for (let i = 0; i < this.atlusHexes.length; i++) {
      const atlus = this.atlusHexes[i];
      this.setAtlusTerrain(atlus);
    }

    // for each atlus hex center get the atlus sub-hexes
    // randomly assign a terrain type as the primary type
    // assign primary type to center
    // assign the other hexes if not already assigned
  }

  setAtlusTerrain(atlus: AtlusHex) {
    const typeKeys = Object.keys(
      assignmentTable
    ) as (keyof typeof assignmentTable)[];
    const typeIndex = getRandomInt(0, typeKeys.length - 1);
    const type = typeKeys[typeIndex];
    const assignments = assignmentTable[type]!;

    const primaryType = this.getRandomTerrain(assignments.primary);
    this.setTerrain(atlus.center, primaryType);

    const wholeShuffled = shuffle(atlus.whole);
    const wholePrimary = wholeShuffled.slice(0, 9);
    const wholeSecondary = wholeShuffled.slice(9, 15);
    const wholeTertiary = wholeShuffled.slice(15);

    wholePrimary.forEach((h) => {
      this.setTerrain(h, this.getRandomTerrain(assignments.primary));
    });

    wholeSecondary.forEach((h) => {
      this.setTerrain(h, this.getRandomTerrain(assignments.secondary));
    });

    wholeTertiary.forEach((h) => {
      this.setTerrain(
        h,
        this.getRandomTerrain([
          ...assignments.tertiary,
          ...assignments.wildcard,
        ])
      );
    });

    atlus.half.forEach((h) => {
      this.setTerrain(
        h,
        this.getRandomTerrain([
          ...assignments.primary,
          ...assignments.secondary,
          ...assignments.tertiary,
        ])
      );
    });
  }

  private setTerrain(hex: Hex, terrain: Terrain) {
    const index = this.hexGrid.toIndex(hex);
    const sprite = terrainSprites[terrain];
    if (index === -1) return;
    if (!sprite) return;
    this.terrainSprites[index] = sprite;
    this.terrainOrder[index] = terrainOrder[terrain]!;
  }

  private getRandomTerrain(terrains: { type: Terrain; chance: number }[]) {
    const expanded = terrains.flatMap((t) => Array(t.chance).fill(t));
    const winner = expanded[Math.floor(prng() * expanded.length)];
    return winner.type;
  }

  private getAtluses(centers: Hex[]) {
    if (this.hexGrid.layout.orientation === Layout.flat) {
      const subhexMap = HexTerrain.subhexesFlat;
      const atlusHexes: AtlusHex[] = [];

      for (let i = 0; i < centers.length; i++) {
        const center = centers[i];
        const whole: Hex[] = [];
        const half: Hex[] = [];

        for (let j = 0; j < subhexMap.whole.length; j++) {
          const hex = center.add(subhexMap.whole[j]);
          whole.push(hex);
        }

        for (let j = 0; j < subhexMap.half.length; j++) {
          const hex = center.add(subhexMap.half[j]);
          half.push(hex);
        }

        atlusHexes.push({ center, whole, half });
      }

      return atlusHexes;
    } else {
      return [];
    }
  }

  private getCenters() {
    if (this.hexGrid.layout.orientation === Layout.flat) {
      const startHex = this.hexGrid.grid[0].add(new Hex(-2, 1, 1));
      const columns = (this.hexGrid.gridSize.x / this.atlusWidth) * 1.5 + 2;
      const rows = this.hexGrid.gridSize.y / this.atlusHeight + 3;

      const columnHexes = [startHex];
      const columnEvenAdd = new Hex(5, -5, 0);
      const columnOddAdd = new Hex(5, 0, -5);
      const rowAdd = new Hex(0, 5, -5);
      const hexes = [];

      for (let i = 0; i < columns; i++) {
        const addHex = i % 2 === 0 ? columnEvenAdd : columnOddAdd;
        const hex = columnHexes[i];
        columnHexes.push(hex.add(addHex));
      }

      for (let i = 0; i < columnHexes.length; i++) {
        let hex = columnHexes[i];
        hexes.push(hex);

        for (let j = 0; j < rows; j++) {
          hex = hex.add(rowAdd);
          hexes.push(hex);
        }
      }

      return hexes;
    } else {
      return [];
    }
  }
}
