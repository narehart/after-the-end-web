import type { BuildGridWithItemsProps, BuildGridWithItemsReturn } from '../types/utils';
import { createEmptyGrid } from './createEmptyGrid';
import { placeItem } from './placeItem';

export type { ItemPlacement } from '../types/ui';

export function buildGridWithItems(props: BuildGridWithItemsProps): BuildGridWithItemsReturn {
  const { width, height, items } = props;
  const cells = createEmptyGrid({ width, height });
  for (const item of items) {
    placeItem({
      grid: cells,
      itemId: item.id,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    });
  }
  return cells;
}
