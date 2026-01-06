import { DEFAULT_QUANTITY } from '../constants/numbers';
import type { Item } from '../types/inventory';
import type { GridOperationBaseProps, GridOperationBaseReturn } from '../types/utils';
import { removeItemFromCells } from './removeItemFromCells';
import { removeItemFromMap } from './removeItemFromMap';
import { updateGridCells } from './updateGridCells';

interface MergeAndRemoveItemProps extends GridOperationBaseProps {
  compatibleStackId: string;
  itemQty: number;
  location: { gridId: string; positions: Array<{ x: number; y: number }> };
  sourceGrid: { cells: Array<Array<string | null>>; width: number; height: number };
}

type MergeAndRemoveItemReturn = GridOperationBaseReturn;

export function mergeAndRemoveItem(
  props: MergeAndRemoveItemProps
): MergeAndRemoveItemReturn | null {
  const { items, grids, itemId, compatibleStackId, itemQty, location, sourceGrid } = props;
  const targetItem = items[compatibleStackId];
  if (targetItem === undefined) return null;

  const targetQty = targetItem.quantity ?? DEFAULT_QUANTITY;
  const updatedTargetItem: Item = { ...targetItem, quantity: targetQty + itemQty };
  const newSourceCells = removeItemFromCells({
    cells: sourceGrid.cells,
    positions: location.positions,
  });

  const updatedGrids = updateGridCells({ grids, gridId: location.gridId, cells: newSourceCells });
  if (updatedGrids === null) return null;

  return {
    items: { ...removeItemFromMap({ items, itemId }), [compatibleStackId]: updatedTargetItem },
    grids: updatedGrids,
  };
}
