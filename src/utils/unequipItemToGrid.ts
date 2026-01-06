import type { Equipment, GridsMap, ItemsMap } from '../types/inventory';
import { findEquipmentSlot } from './findEquipmentSlot';
import { findFreePosition } from './findFreePosition';
import { placeItemInCells } from './placeItemInCells';

interface UnequipItemToGridProps {
  items: ItemsMap;
  grids: GridsMap;
  equipment: Equipment;
  itemId: string;
  targetGridId: string;
}

interface UnequipItemToGridReturn {
  equipment: Equipment;
  grids: GridsMap;
}

export function unequipItemToGrid(props: UnequipItemToGridProps): UnequipItemToGridReturn | null {
  const { items, grids, equipment, itemId, targetGridId } = props;

  const item = items[itemId];
  if (item === undefined) return null;

  const equipmentSlot = findEquipmentSlot({ equipment, itemId });
  if (equipmentSlot === null) return null;

  const targetGrid = grids[targetGridId];
  if (targetGrid === undefined) return null;

  const freePos = findFreePosition({
    grid: targetGrid,
    itemWidth: item.size.width,
    itemHeight: item.size.height,
  });
  if (freePos === null) return null;

  const newCells = placeItemInCells({
    grid: targetGrid.cells,
    itemId,
    x: freePos.x,
    y: freePos.y,
    width: item.size.width,
    height: item.size.height,
  });

  return {
    equipment: { ...equipment, [equipmentSlot]: null },
    grids: { ...grids, [targetGridId]: { ...targetGrid, cells: newCells } },
  };
}
