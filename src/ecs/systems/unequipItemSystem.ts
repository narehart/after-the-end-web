/**
 * Unequip Item System
 *
 * Moves an equipped item from an equipment slot to a grid.
 */

import type { GridId, EntityId } from '../world';
import type { EquipmentSlot } from '../../types/equipment';
import { getGridEntity, getItemEntity, getEquipment } from '../queries/inventoryQueries';
import { findFreePosition } from '../../utils/findFreePosition';
import { placeItem } from '../../utils/placeItem';
import { findEquippedSlot } from '../../utils/findEquippedSlot';

interface UnequipItemProps {
  entityId: EntityId;
  targetGridId: GridId;
}

interface UnequipItemReturn {
  success: boolean;
  slotType: EquipmentSlot | null;
}

export function unequipItem(props: UnequipItemProps): UnequipItemReturn {
  const { entityId, targetGridId } = props;
  const failResult: UnequipItemReturn = { success: false, slotType: null };

  const itemEntity = getItemEntity({ entityId });
  const { equipment } = getEquipment();
  const gridEntity = getGridEntity({ gridId: targetGridId });

  if (itemEntity?.template?.template === undefined) return failResult;
  if (gridEntity?.grid === undefined) return failResult;

  const foundSlot = findEquippedSlot({ equipment, entityId });
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

  placeItem({
    grid: gridEntity.grid.cells,
    itemId: entityId,
    x: freePos.x,
    y: freePos.y,
    width: item.size.width,
    height: item.size.height,
  });

  itemEntity.position = { gridId: targetGridId, x: freePos.x, y: freePos.y };
  equipment[foundSlot] = null;

  return { success: true, slotType: foundSlot };
}
