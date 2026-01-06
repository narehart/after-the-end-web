/**
 * Destroy Item System
 *
 * Removes an item entity from its grid/equipment and the world.
 */

import { world } from '../world';
import type { EntityId } from '../world';
import type { EquipmentSlot } from '../../types/equipment';
import { EQUIPMENT_SLOTS } from '../../constants/equipment';
import { getGridEntity, getItemEntity, removeFromCells } from '../queries/inventoryQueries';

interface DestroyItemProps {
  entityId: EntityId;
}

interface DestroyItemReturn {
  success: boolean;
  slotType: EquipmentSlot | null;
}

export type { DestroyItemProps, DestroyItemReturn };

function clearEquipmentSlot(entityId: EntityId): EquipmentSlot | null {
  for (const entity of world) {
    if (entity.equipment === undefined) continue;
    const slots = entity.equipment.slots;
    for (const slot of EQUIPMENT_SLOTS) {
      if (slots[slot] === entityId) {
        slots[slot] = null;
        return slot;
      }
    }
  }
  return null;
}

export function destroyItem(props: DestroyItemProps): DestroyItemReturn {
  const { entityId } = props;

  const itemEntity = getItemEntity({ entityId });
  if (itemEntity === undefined) {
    return { success: false, slotType: null };
  }

  // Remove from grid if positioned
  if (itemEntity.position !== undefined) {
    const gridEntity = getGridEntity({ gridId: itemEntity.position.gridId });
    if (gridEntity?.grid !== undefined) {
      removeFromCells({ cells: gridEntity.grid.cells, entityId });
    }
  }

  const clearedSlot = clearEquipmentSlot(entityId);
  world.remove(itemEntity);
  return { success: true, slotType: clearedSlot };
}
