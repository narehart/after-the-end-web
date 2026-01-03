import type { BuildInitialInventoryReturn } from '../types/utils';
import { GROUND_HEIGHT, GROUND_WIDTH } from '../constants/ground';
import { buildGridWithItems } from './buildGridWithItems';
import { createContainerGrids } from './createContainerGrids';
import { createEquipmentInstances } from './createEquipmentInstances';
import { getRandomGroundLayout } from './getRandomGroundLayout';

export function buildInitialInventory(): BuildInitialInventoryReturn {
  const equipmentResult = createEquipmentInstances();
  const grids = { ...equipmentResult.grids };
  const allInstances = { ...equipmentResult.instances };

  // Add items to pouch
  const pouchInstanceId = equipmentResult.equipment.pouch;
  if (pouchInstanceId !== null) {
    const pouchResult = buildGridWithItems({
      width: 4,
      height: 6,
      items: [
        { id: 'neo_4', x: 0, y: 0 },
        { id: 'neo_12', x: 2, y: 0 },
      ],
    });
    grids[pouchInstanceId] = { width: 4, height: 6, cells: pouchResult.cells };
    Object.assign(allInstances, pouchResult.instances);
    Object.assign(grids, createContainerGrids({ instances: pouchResult.instances }));
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
