import type { BuildGridWithItemsProps, BuildGridWithItemsReturn } from '../types/utils';
import { getItemById } from '../data/items';
import { canPlaceAt } from './canPlaceAt';
import { createEmptyGrid } from './createEmptyGrid';
import { placeItem } from './placeItem';

export type { ItemPlacement } from '../types/ui';

export function buildGridWithItems(props: BuildGridWithItemsProps): BuildGridWithItemsReturn {
  const { width, height, items } = props;
  const cells = createEmptyGrid({ width, height });
  for (const placement of items) {
    const item = getItemById(placement.id);
    if (item === undefined) {
      continue;
    }
    const canPlace = canPlaceAt({
      grid: cells,
      x: placement.x,
      y: placement.y,
      width: item.size.width,
      height: item.size.height,
    });
    if (!canPlace) {
      console.warn(
        `Cannot place item ${placement.id} at (${placement.x}, ${placement.y}) - space occupied`
      );
      continue;
    }
    placeItem({
      grid: cells,
      itemId: placement.id,
      x: placement.x,
      y: placement.y,
      width: item.size.width,
      height: item.size.height,
    });
  }
  return cells;
}
