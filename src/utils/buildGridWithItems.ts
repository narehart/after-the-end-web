import type { BuildGridWithItemsProps, BuildGridWithItemsReturn } from '../types/utils';
import { getItemById } from '../data/items';
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
