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
    sprite: {
      id: "hex-water-001",
      offset: -6,
      animation: ["hex-animations-water-001", 50, 1, true, true],
    },
  },
  swamp: {
    sprite: {
      id: "hex-swamp-003",
    },
  },
  desert: {
    sprite: {
      id: "hex-desert-002",
    },
  },
  plains: {
    sprite: {
      id: "hex-plains-006",
    },
  },
  forest: {
    sprite: {
      id: "hex-forest-003",
    },
  },
  forestHeavy: {
    sprite: {
      id: "hex-forest-heavy-002",
    },
  },
  forestLight: {
    sprite: {
      id: "hex-forest-light-002",
    },
  },
  mountains: {
    sprite: {
      id: "hex-mountains-003",
    },
  },
  hills: {
    sprite: {
      id: "hex-hills-004",
    },
  },
  desertHillsRocky: {
    sprite: {
      id: "hex-desert-hills-001",
    },
  },
  forestHills: {
    sprite: {
      id: "hex-forest-hills-002",
    },
  },
  forestMountains: {
    sprite: {
      id: "hex-forest-mountains-002",
    },
  },
  dominatingPeak: {
    sprite: {
      id: "hex-dominating-peak-002",
    },
  },
  desertMountains: {
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
