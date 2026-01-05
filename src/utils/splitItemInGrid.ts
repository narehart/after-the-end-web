import { DEFAULT_QUANTITY } from '../constants/numbers';
import type { GridsMap, Item, ItemsMap } from '../types/inventory';
import { findFreePosition } from './findFreePosition';
import { generateInstanceId } from './generateInstanceId';
import { placeItemInCells } from './placeItemInCells';

interface SplitItemInGridProps {
  items: ItemsMap;
  grids: GridsMap;
  itemId: string;
  targetGridId: string;
}

interface SplitItemInGridReturn {
  items: ItemsMap;
  grids: GridsMap;
}

export function splitItemInGrid(props: SplitItemInGridProps): SplitItemInGridReturn | null {
  const { items, grids, itemId, targetGridId } = props;
  const item = items[itemId];
  if (item === undefined) return null;

  const currentQty = item.quantity ?? DEFAULT_QUANTITY;
  if (currentQty <= DEFAULT_QUANTITY) return null;

  const targetGrid = grids[targetGridId];
  if (targetGrid === undefined) return null;

  const freePos = findFreePosition({
    grid: targetGrid,
    itemWidth: item.size.width,
    itemHeight: item.size.height,
  });
  if (freePos === null) return null;

  const newItemId = generateInstanceId(item.neoId);
  const newItem: Item = {
    ...item,
    id: newItemId,
    quantity: DEFAULT_QUANTITY,
  };

  const updatedItem: Item = {
    ...item,
    quantity: currentQty - DEFAULT_QUANTITY,
  };

  const newTargetCells = placeItemInCells({
    grid: targetGrid.cells,
    itemId: newItemId,
    x: freePos.x,
    y: freePos.y,
    width: item.size.width,
    height: item.size.height,
  });

  return {
    items: {
      ...items,
      [itemId]: updatedItem,
      [newItemId]: newItem,
    },
    grids: {
      ...grids,
      [targetGridId]: { ...targetGrid, cells: newTargetCells },
    },
  };
}
