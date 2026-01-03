import type { CellGrid } from '../types/inventory';
import type { ItemPlacement } from '../types/ui';
import { createEmptyGrid } from './createEmptyGrid';
import { placeItem } from './placeItem';

export type { ItemPlacement } from '../types/ui';

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
