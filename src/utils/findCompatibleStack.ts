import { DEFAULT_QUANTITY } from '../constants/items';
import type { GridCell, ItemsMap } from '../types/inventory';

;

interface FindCompatibleStackProps {
  grid: GridCell;
  items: ItemsMap;
  sourceNeoId: string;
  addQuantity: number;
  stackLimit: number;
}

export function findCompatibleStack(props: FindCompatibleStackProps): string | null {
  const { grid, items, sourceNeoId, addQuantity, stackLimit } = props;

  // Get unique item IDs in the grid
  const uniqueIds = new Set<string>();
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell !== null) {
        uniqueIds.add(cell);
      }
    }
  }

  // Find a compatible stack
  for (const itemId of uniqueIds) {
    const item = items[itemId];
    if (item === undefined) continue;

    // Must be same item type
    if (item.neoId !== sourceNeoId) continue;

    // Must have room in stack
    const currentQty = item.quantity ?? DEFAULT_QUANTITY;
    if (currentQty + addQuantity <= stackLimit) {
      return itemId;
    }
  }

  return null;
}
