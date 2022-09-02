import { HexTypeName } from "./hex";

type PrimaryTerrain = Extract<
  HexTypeName,
  "water" | "swamp" | "desert" | "plains" | "forest" | "hills" | "mountains"
>;

export const hexTerrainAssignments: {
  [key in PrimaryTerrain]?: {
    primary: { type: HexTypeName; chance: number }[];
    secondary: { type: HexTypeName; chance: number }[];
    tertiary: { type: HexTypeName; chance: number }[];
    wildcard: { type: HexTypeName; chance: number }[];
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
