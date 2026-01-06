import { DEFAULT_QUANTITY } from '../constants/numbers';
import type { Item } from '../types/inventory';
import type { GridOperationBaseProps, GridOperationBaseReturn } from '../types/utils';
import { findCompatibleStack } from './findCompatibleStack';
import { findFreePosition } from './findFreePosition';
import { generateInstanceId } from './generateInstanceId';
import { mergeIntoStack } from './mergeIntoStack';
import { placeItemInCells } from './placeItemInCells';

interface SplitItemInGridProps extends GridOperationBaseProps {
  targetGridId: string;
}

type SplitItemInGridReturn = GridOperationBaseReturn;

export function splitItemInGrid(props: SplitItemInGridProps): SplitItemInGridReturn | null {
  const { items, grids, itemId, targetGridId } = props;
  const item = items[itemId];
  if (item === undefined) return null;

  const currentQty = item.quantity ?? DEFAULT_QUANTITY;
  if (currentQty <= DEFAULT_QUANTITY) return null;

  const targetGrid = grids[targetGridId];
  if (targetGrid === undefined) return null;

  // Check for compatible stack to merge with (excluding source item)
  const compatibleStackId = findCompatibleStack({
    grid: targetGrid,
    items,
    sourceNeoId: item.neoId,
    addQuantity: DEFAULT_QUANTITY,
    stackLimit: item.stackLimit,
  });

  // If compatible stack found (and it's not the source item), merge
  if (compatibleStackId !== null && compatibleStackId !== itemId) {
    const mergeResult = mergeIntoStack({
      items,
      sourceItemId: itemId,
      targetItemId: compatibleStackId,
      addQuantity: DEFAULT_QUANTITY,
    });
    if (mergeResult !== null) {
      return { items: mergeResult.items, grids };
    }
  }

  // No compatible stack, create new item
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

  const updatedSourceItem: Item = {
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
      [itemId]: updatedSourceItem,
      [newItemId]: newItem,
    },
    grids: {
      ...grids,
      [targetGridId]: { ...targetGrid, cells: newTargetCells },
    },
  };
}
