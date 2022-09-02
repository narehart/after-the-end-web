import { hexData, HexTypeName } from "../data/hex";
import { hexTerrainAssignments } from "../data/hex-terrain";
import { getRandomInt, shuffle, prng } from "../game-engine/utils/rng";
import { Hex, HexGrid, Layout } from "./hex-grid";

type Subhex = { whole: Hex[]; half: Hex[] };
type AtlusHex = Subhex & { center: Hex };

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
  public hexType: HexTypeName[] = [];

  constructor(private hexGrid: HexGrid) {}

  public generate() {
    this.centerHexes = this.getCenters();
    this.atlusHexes = this.getAtluses(this.centerHexes);

    for (let i = 0; i < this.atlusHexes.length; i++) {
      const atlus = this.atlusHexes[i];
      this.setAtlusTerrain(atlus);
    }
  }

  private setAtlusTerrain(atlus: AtlusHex) {
    const typeKeys = Object.keys(
      hexTerrainAssignments
    ) as (keyof typeof hexTerrainAssignments)[];
    const typeIndex = getRandomInt(0, typeKeys.length - 1);
    const type = typeKeys[typeIndex];
    const assignments = hexTerrainAssignments[type]!;

    const primaryType = this.getRandomTerrain(assignments.primary);
    const wholeShuffled = shuffle(atlus.whole);
    const wholePrimary = wholeShuffled.slice(0, 9);
    const wholeSecondary = wholeShuffled.slice(9, 15);
    const wholeTertiary = wholeShuffled.slice(15);

    this.setTerrain(atlus.center, primaryType);

    for (let i = 0; i < wholePrimary.length; i++) {
      const h = wholePrimary[i];
      this.setTerrain(h, this.getRandomTerrain(assignments.primary));
    }

    for (let i = 0; i < wholeSecondary.length; i++) {
      const h = wholeSecondary[i];
      this.setTerrain(h, this.getRandomTerrain(assignments.secondary));
    }

    for (let i = 0; i < wholeTertiary.length; i++) {
      const h = wholeTertiary[i];
      this.setTerrain(
        h,
        this.getRandomTerrain([
          ...assignments.tertiary,
          ...assignments.wildcard,
        ])
      );
    }

    for (let i = 0; i < atlus.half.length; i++) {
      const h = atlus.half[i];
      this.setTerrain(
        h,
        this.getRandomTerrain([
          ...assignments.primary,
          ...assignments.secondary,
          ...assignments.tertiary,
        ])
      );
    }
  }

  private setTerrain(hex: Hex, terrain: HexTypeName) {
    const index = this.hexGrid.toIndex(hex);
    const sprite = hexData[terrain].sprite.id;

    if (index === -1) return;
    if (!sprite) return;

    this.hexType[index] = terrain;
  }

  private getRandomTerrain(terrains: { type: HexTypeName; chance: number }[]) {
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
