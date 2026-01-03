import type { Equipment, GridsMap, ItemsMap } from '../types/inventory';
import type { CreateEquipmentInstancesReturn } from '../types/utils';
import { SLOT_TYPES } from '../constants/slots';
import { INITIAL_EQUIPMENT } from '../constants/equipment';
import { getItemById } from '../data/items';
import { createEmptyGrid } from './createEmptyGrid';
import { createItemInstance } from './createItemInstance';
import { generateInstanceId } from './generateInstanceId';

export function createEquipmentInstances(): CreateEquipmentInstancesReturn {
  const instances: ItemsMap = {};
  const grids: GridsMap = {};
  const equipment: Equipment = { ...INITIAL_EQUIPMENT };

  for (const slot of SLOT_TYPES) {
    const neoId = INITIAL_EQUIPMENT[slot];
    if (neoId === null) continue;

    const template = getItemById(neoId);
    if (template === undefined) continue;

    const instanceId = generateInstanceId(neoId);
    const instance = createItemInstance({ template, instanceId });
    instances[instanceId] = instance;
    equipment[slot] = instanceId;

    if (template.gridSize !== undefined) {
      grids[instanceId] = {
        width: template.gridSize.width,
        height: template.gridSize.height,
        cells: createEmptyGrid({
          width: template.gridSize.width,
          height: template.gridSize.height,
        }),
      };
    }
  }

  return { instances, grids, equipment };
}
