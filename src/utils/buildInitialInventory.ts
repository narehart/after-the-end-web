import type { BuildInitialInventoryReturn } from '../types/utils';
import { GROUND_HEIGHT, GROUND_WIDTH } from '../constants/ground';
import { buildGridWithItems } from './buildGridWithItems';
import { createContainerGrids } from './createContainerGrids';
import { createEquipmentInstances } from './createEquipmentInstances';
import { getRandomGroundLayout } from './getRandomGroundLayout';
import { populateContainer } from './populateContainer';

export function buildInitialInventory(): BuildInitialInventoryReturn {
  const equipmentResult = createEquipmentInstances();
  const grids = { ...equipmentResult.grids };
  const allInstances = { ...equipmentResult.instances };

  // Add random items to pouch
  const pouchInstanceId = equipmentResult.equipment.pouch;
  if (pouchInstanceId !== null) {
    const pouchContents = populateContainer({ width: 4, height: 6 });
    grids[pouchInstanceId] = pouchContents.grid;
    Object.assign(allInstances, pouchContents.instances);
    Object.assign(grids, pouchContents.containerGrids);
  }

  // Add random items to backpack
  const backpackInstanceId = equipmentResult.equipment.backpack;
  if (backpackInstanceId !== null) {
    const backpackContents = populateContainer({ width: 10, height: 10 });
    grids[backpackInstanceId] = backpackContents.grid;
    Object.assign(allInstances, backpackContents.instances);
    Object.assign(grids, backpackContents.containerGrids);
  }

  // Build ground
  const groundResult = buildGridWithItems({
    width: GROUND_WIDTH,
    height: GROUND_HEIGHT,
    items: getRandomGroundLayout(),
  });
  grids['ground'] = { width: GROUND_WIDTH, height: GROUND_HEIGHT, cells: groundResult.cells };
  Object.assign(allInstances, groundResult.instances);
  Object.assign(grids, createContainerGrids({ instances: groundResult.instances }));

  return { grids, instances: allInstances, equipment: equipmentResult.equipment };
}
