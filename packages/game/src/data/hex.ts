import { AnimatedSpriteComponent } from "../game-engine/ecs/components/animated-sprite";
import { Sprites } from "./sprites";

export type HexTypeName =
  | "water"
  | "swamp"
  | "desert"
  | "plains"
  | "hills"
  | "forest"
  | "mountains"
  | "forestLight"
  | "forestHeavy"
  | "forestHills"
  | "forestMountains"
  | "dominatingPeak"
  | "desertHillsRocky"
  | "dominatingPeak"
  | "desertMountains";

type HexData = {
  [key: string]: {
    name: string;
    sprite: {
      id: Sprites;
      offset?: number;
      animation?: ConstructorParameters<
        typeof AnimatedSpriteComponent<Sprites>
      >;
    };
  };
};

export const hexData: HexData = {
  water: {
    name: "Water",
    sprite: {
      id: "hex-water-001",
      offset: -6,
      animation: ["hex-animations-water-001", 50, 1, true, true],
    },
  },
  swamp: {
    name: "Swamp",
    sprite: {
      id: "hex-swamp-003",
    },
  },
  desert: {
    name: "Desert",
    sprite: {
      id: "hex-desert-002",
    },
  },
  plains: {
    name: "Plains",
    sprite: {
      id: "hex-plains-006",
    },
  },
  forest: {
    name: "Forest",
    sprite: {
      id: "hex-forest-003",
    },
  },
  forestHeavy: {
    name: "Dense Forest",
    sprite: {
      id: "hex-forest-heavy-002",
    },
  },
  forestLight: {
    name: "Light Forest",
    sprite: {
      id: "hex-forest-light-002",
    },
  },
  mountains: {
    name: "Mountains",
    sprite: {
      id: "hex-mountains-003",
    },
  },
  hills: {
    name: "Hills",
    sprite: {
      id: "hex-hills-004",
    },
  },
  desertHillsRocky: {
    name: "Dunes",
    sprite: {
      id: "hex-desert-hills-001",
    },
  },
  forestHills: {
    name: "Forest Hills",
    sprite: {
      id: "hex-forest-hills-002",
    },
  },
  forestMountains: {
    name: "Forest Mountains",
    sprite: {
      id: "hex-forest-mountains-002",
    },
  },
  dominatingPeak: {
    name: "Dominating Peak",
    sprite: {
      id: "hex-dominating-peak-002",
    },
  },
  desertMountains: {
    name: "Desert Mountains",
    sprite: {
      id: "hex-desert-mountains-001",
    },
  },
};

export const hexCursor = {
  default: {
    sprite: {
      id: "hex-cursor",
      offset: -6,
    },
  },
};
