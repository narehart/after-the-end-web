import type { Item } from '../types/inventory';

export interface ItemDimensions {
  itemWidth: number;
  itemHeight: number;
}

const CELL_GAP = 2;

export function calculateItemDimensions(item: Item, cellSize: number): ItemDimensions {
  const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
  return { itemWidth, itemHeight };
}
