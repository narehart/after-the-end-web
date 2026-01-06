import type { GridsMap, ItemsMap } from '../types/inventory';
import type { Equipment } from '../types/equipment';
import { EQUIPMENT_SLOTS, INITIAL_EQUIPMENT } from '../constants/equipment';
import { getItemById } from './getItemById';
import { createEmptyGrid } from './createEmptyGrid';
import { createItemInstance } from './createItemInstance';
import { generateInstanceId } from './generateInstanceId';

interface CreateEquipmentInstancesReturn {
  instances: ItemsMap;
  grids: GridsMap;
  equipment: Equipment;
}

export function createEquipmentInstances(): CreateEquipmentInstancesReturn {
  const instances: ItemsMap = {};
  const grids: GridsMap = {};
  const equipment: Equipment = { ...INITIAL_EQUIPMENT };

  for (const slot of EQUIPMENT_SLOTS) {
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
