import type { GridsMap, ItemsMap } from '../types/inventory';
import type { BuildInitialInventoryReturn } from '../types/utils';
import { GROUND_HEIGHT, GROUND_WIDTH } from '../constants/ground';
import { buildGridWithItems } from './buildGridWithItems';
import { createEmptyGrid } from './createEmptyGrid';
import { getRandomGroundLayout } from './getRandomGroundLayout';

export function buildInitialInventory(): BuildInitialInventoryReturn {
  const allInstances: ItemsMap = {};
  const grids: GridsMap = {};

  // Empty grids for equipment containers (no items placed yet)
  // neo_57 = night vision goggles with 1x1 battery slot
  grids['neo_57'] = {
    width: 1,
    height: 1,
    cells: createEmptyGrid({ width: 1, height: 1 }),
  };

  // neo_42 = bag with 10x10 grid (equipped as backpack)
  grids['neo_42'] = {
    width: 10,
    height: 10,
    cells: createEmptyGrid({ width: 10, height: 10 }),
  };

  // neo_1 = bag with 4x6 grid (equipped as pouch)
  const pouchResult = buildGridWithItems({
    width: 4,
    height: 6,
    items: [
      { id: 'neo_4', x: 0, y: 0 }, // tin can
      { id: 'neo_12', x: 2, y: 0 }, // bracelet
    ],
  });
  grids['neo_1'] = {
    width: 4,
    height: 6,
    cells: pouchResult.cells,
  };
  Object.assign(allInstances, pouchResult.instances);

  // neo_4 = tin can with 2x2 grid
  grids['neo_4'] = {
    width: 2,
    height: 2,
    cells: createEmptyGrid({ width: 2, height: 2 }),
  };

  // Ground grid with random items
  const groundResult = buildGridWithItems({
    width: GROUND_WIDTH,
    height: GROUND_HEIGHT,
    items: getRandomGroundLayout(),
  });
  grids['ground'] = {
    width: GROUND_WIDTH,
    height: GROUND_HEIGHT,
    cells: groundResult.cells,
  };
  Object.assign(allInstances, groundResult.instances);

  return { grids, instances: allInstances };
}
