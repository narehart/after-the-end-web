/**
 * Unequip Item System
 *
 * Moves an equipped item from an equipment slot to a grid.
 */

import { world } from '../world';
import type { Entity, GridId, EntityId } from '../world';
import type { Equipment, SlotType } from '../../types/inventory';
import { findFreePosition, placeInCells } from '../queries/inventoryQueries';
import { SLOT_TYPES } from '../../constants/slots';

interface UnequipItemProps {
  entityId: EntityId;
  targetGridId: GridId;
}

interface UnequipItemReturn {
  success: boolean;
  slotType: SlotType | null;
}

function findEquippedSlot(equipment: Equipment, entityId: EntityId): SlotType | null {
  for (const slot of SLOT_TYPES) {
    if (equipment[slot] === entityId) {
      return slot;
    }
  }
  return null;
}

function getItemEntity(entityId: EntityId): Entity | undefined {
  return world.where((e) => e.id === entityId && e.item !== undefined).first;
}

function getEquipmentEntity(): Entity | undefined {
  return world.where((e) => e.equipment !== undefined).first;
}

function getGridEntity(gridId: GridId): Entity | undefined {
  return world.where((e) => e.grid?.gridId === gridId).first;
}

export function unequipItem(props: UnequipItemProps): UnequipItemReturn {
  const { entityId, targetGridId } = props;
  const failResult: UnequipItemReturn = { success: false, slotType: null };

  const itemEntity = getItemEntity(entityId);
  const equipmentEntity = getEquipmentEntity();
  const gridEntity = getGridEntity(targetGridId);

  if (itemEntity?.template?.template === undefined) return failResult;
  if (equipmentEntity?.equipment === undefined) return failResult;
  if (gridEntity?.grid === undefined) return failResult;

  const foundSlot = findEquippedSlot(equipmentEntity.equipment.slots, entityId);
  if (foundSlot === null) return failResult;

  const item = itemEntity.template.template;
  const freePos = findFreePosition({
    cells: gridEntity.grid.cells,
    gridWidth: gridEntity.grid.width,
    gridHeight: gridEntity.grid.height,
    itemWidth: item.size.width,
    itemHeight: item.size.height,
  });

  if (freePos === null) return failResult;

  placeInCells({
    cells: gridEntity.grid.cells,
    entityId,
    x: freePos.x,
    y: freePos.y,
    width: item.size.width,
    height: item.size.height,
  });

  itemEntity.position = { gridId: targetGridId, x: freePos.x, y: freePos.y };
  equipmentEntity.equipment.slots[foundSlot] = null;

  return { success: true, slotType: foundSlot };
}
