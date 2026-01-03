import type { GridsMap } from '../types/inventory';
import { buildGridWithItems } from '../utils/buildGridWithItems';
import { createEmptyGrid } from '../utils/createEmptyGrid';

// Using neoItems IDs - neo_1 is bag (4x6), neo_4 is tin can (2x2 container), neo_42 is bag (10x10)
export const initialGrids: GridsMap = {
  // neo_42 = bag with 10x10 grid (equipped as backpack)
  neo_42: {
    width: 10,
    height: 10,
    cells: createEmptyGrid({ width: 10, height: 10 }),
  },
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
        { id: 'neo_12', x: 0, y: 1, width: 2, height: 1 }, // bracelet 2x1
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
        { id: 'neo_9', x: 0, y: 0, width: 2, height: 2 }, // call melonhead 2x2
        { id: 'neo_16', x: 3, y: 0, width: 3, height: 2 }, // skill: hacking 3x2
        { id: 'neo_1', x: 7, y: 0, width: 1, height: 1 }, // bag (container)
        { id: 'neo_3', x: 8, y: 0, width: 1, height: 1 }, // branch
      ],
    }),
  },
};
