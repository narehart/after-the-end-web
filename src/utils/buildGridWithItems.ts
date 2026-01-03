import type { CellGrid } from '../types/inventory';
import { createEmptyGrid } from './createEmptyGrid';
import { placeItem } from './placeItem';

export interface ItemPlacement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function buildGridWithItems(
  width: number,
  height: number,
  items: ItemPlacement[]
): CellGrid {
  const cells = createEmptyGrid(width, height);
  for (const item of items) {
    placeItem(cells, item.id, item.x, item.y, item.width, item.height);
  }
  return cells;
}
