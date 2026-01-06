import type { Equipment, GridsMap, ItemsMap } from '../types/inventory';
import { GROUND_HEIGHT, GROUND_WIDTH } from '../constants/inventory';
import { buildGridWithItems } from './buildGridWithItems';
import { createContainerGrids } from './createContainerGrids';
import { createEquipmentInstances } from './createEquipmentInstances';
import { getRandomGroundLayout } from './getRandomGroundLayout';
import { populateEquippedContainer } from './populateEquippedContainer';

interface BuildInitialInventoryReturn {
  grids: GridsMap;
  instances: ItemsMap;
  equipment: Equipment;
}

export function buildInitialInventory(): BuildInitialInventoryReturn {
  const equipmentResult = createEquipmentInstances();
  let grids = { ...equipmentResult.grids };
  let allInstances = { ...equipmentResult.instances };

  // Populate pouch with random items
  const pouchResult = populateEquippedContainer({
    instanceId: equipmentResult.equipment.pouch,
    grids,
    allInstances,
  });
  grids = pouchResult.grids;
  allInstances = pouchResult.instances;

  // Populate backpack with random items
  const backpackResult = populateEquippedContainer({
    instanceId: equipmentResult.equipment.backpack,
    grids,
    allInstances,
  });
  grids = backpackResult.grids;
  allInstances = backpackResult.instances;

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
