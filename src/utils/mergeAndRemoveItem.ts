import { DEFAULT_QUANTITY } from '../constants/numbers';
import type { GridsMap, Item, ItemsMap } from '../types/inventory';
import { removeItemFromCells } from './removeItemFromCells';

interface MergeAndRemoveItemProps {
  items: ItemsMap;
  grids: GridsMap;
  itemId: string;
  compatibleStackId: string;
  itemQty: number;
  location: { gridId: string; positions: Array<{ x: number; y: number }> };
  sourceGrid: { cells: Array<Array<string | null>>; width: number; height: number };
}

interface MergeAndRemoveItemReturn {
  items: ItemsMap;
  grids: GridsMap;
}

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
  const { [itemId]: _removed, ...remainingItems } = items;

  return {
    items: { ...remainingItems, [compatibleStackId]: updatedTargetItem },
    grids: { ...grids, [location.gridId]: { ...sourceGrid, cells: newSourceCells } },
  };
}
