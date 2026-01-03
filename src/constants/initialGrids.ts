import type { GridsMap } from '../types/inventory';
import { buildGridWithItems } from '../utils/buildGridWithItems';
import { createEmptyGrid } from '../utils/createEmptyGrid';

// Using neoItems IDs - neo_1 is bag (4x6), neo_4 is tin can (2x2 container)
export const initialGrids: GridsMap = {
  // neo_1 = bag with 4x6 grid
  neo_1: {
    width: 4,
    height: 6,
    cells: buildGridWithItems({
      width: 4,
      height: 6,
      items: [
        { id: 'neo_3', x: 0, y: 0, width: 1, height: 1 }, // branch
        { id: 'neo_5', x: 1, y: 0, width: 1, height: 1 }, // shoes
        { id: 'neo_4', x: 2, y: 0, width: 1, height: 1 }, // tin can (container)
      ],
    }),
  },
  // neo_4 = tin can with 2x2 grid
  neo_4: {
    width: 2,
    height: 2,
    cells: createEmptyGrid({ width: 2, height: 2 }),
  },
  ground: {
    width: 10,
    height: 40,
    cells: buildGridWithItems({
      width: 10,
      height: 40,
      items: [
        { id: 'neo_7', x: 0, y: 0, width: 1, height: 1 }, // clothes (torso)
        { id: 'neo_8', x: 1, y: 0, width: 1, height: 1 }, // clothes (torso)
        { id: 'neo_1', x: 2, y: 0, width: 1, height: 1 }, // bag (container)
      ],
    }),
  },
};
