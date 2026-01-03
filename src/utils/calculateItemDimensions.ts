import type { Item } from '../types/inventory';
import type { ItemDimensions } from '../types/ui';
import { CELL_GAP } from '../constants/grid';

export type { ItemDimensions } from '../types/ui';

export function calculateItemDimensions(item: Item, cellSize: number): ItemDimensions {
  const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
  return { itemWidth, itemHeight };
}
