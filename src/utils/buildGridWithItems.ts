import type { ItemsMap } from '../types/inventory';
import type { BuildGridWithItemsProps, BuildGridWithItemsReturn } from '../types/utils';
import { getItemById } from '../data/items';
import { canPlaceAt } from './canPlaceAt';
import { createEmptyGrid } from './createEmptyGrid';
import { createItemInstance } from './createItemInstance';
import { generateInstanceId } from './generateInstanceId';
import { placeItem } from './placeItem';

export type { ItemPlacement } from '../types/ui';

export function buildGridWithItems(props: BuildGridWithItemsProps): BuildGridWithItemsReturn {
  const { width, height, items } = props;
  const cells = createEmptyGrid({ width, height });
  const instances: ItemsMap = {};

  for (const placement of items) {
    const template = getItemById(placement.id);
    if (template === undefined) {
      continue;
    }

    const canPlace = canPlaceAt({
      grid: cells,
      x: placement.x,
      y: placement.y,
      width: template.size.width,
      height: template.size.height,
    });

    if (!canPlace) {
      console.warn(
        `Cannot place item ${placement.id} at (${placement.x}, ${placement.y}) - space occupied`
      );
      continue;
    }

    const instanceId = generateInstanceId(placement.id);
    const instance = createItemInstance({ template, instanceId });
    instances[instanceId] = instance;

    placeItem({
      grid: cells,
      itemId: instanceId,
      x: placement.x,
      y: placement.y,
      width: template.size.width,
      height: template.size.height,
    });
  }

  return { cells, instances };
}
