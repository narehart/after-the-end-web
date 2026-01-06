import { DEFAULT_QUANTITY } from '../constants/items';
import type { GridOperationBaseProps, GridOperationBaseReturn } from '../types/utils';
import { findCompatibleStack } from './findCompatibleStack';
import { findItemInGrids } from './findItemInGrids';
import { mergeAndRemoveItem } from './mergeAndRemoveItem';
import { regularMoveItem } from './regularMoveItem';

;

interface MoveItemInGridProps extends GridOperationBaseProps {
  targetGridId: string;
}

type MoveItemInGridReturn = GridOperationBaseReturn;

export function moveItemInGrid(props: MoveItemInGridProps): MoveItemInGridReturn | null {
  const { items, grids, itemId, targetGridId } = props;
  const item = items[itemId];
  if (item === undefined) return null;

  const location = findItemInGrids({ grids, itemId });
  if (location === null) return null;
  if (location.gridId === targetGridId) return null;

  const sourceGrid = grids[location.gridId];
  const targetGrid = grids[targetGridId];
  if (sourceGrid === undefined || targetGrid === undefined) return null;

  const itemQty = item.quantity ?? DEFAULT_QUANTITY;

  // Check for compatible stack to merge with
  const compatibleStackId = findCompatibleStack({
    grid: targetGrid,
    items,
    sourceNeoId: item.neoId,
    addQuantity: itemQty,
    stackLimit: item.stackLimit,
  });

  // If compatible stack found, merge and remove source
  if (compatibleStackId !== null) {
    return mergeAndRemoveItem({
      items,
      grids,
      itemId,
      compatibleStackId,
      itemQty,
      location,
      sourceGrid,
    });
  }

  // No merge, do regular move
  return regularMoveItem({
    items,
    grids,
    item,
    itemId,
    targetGridId,
    location,
    sourceGrid,
    targetGrid,
  });
}
