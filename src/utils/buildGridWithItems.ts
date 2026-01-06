import type { CellGrid, ItemsMap } from '../types/inventory';
import type { ItemPlacement } from '../types/ui';
import { getItemById } from '../data/items';
import { canPlaceAt } from './canPlaceAt';
import { createEmptyGrid } from './createEmptyGrid';
import { createItemInstance } from './createItemInstance';
import { generateInstanceId } from './generateInstanceId';
import { placeItem } from './placeItem';

interface BuildGridWithItemsProps {
  width: number;
  height: number;
  items: ItemPlacement[];
}

interface BuildGridWithItemsReturn {
  cells: CellGrid;
  instances: ItemsMap;
}

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
    const instance =
      placement.quantity !== undefined
        ? createItemInstance({ template, instanceId, quantity: placement.quantity })
        : createItemInstance({ template, instanceId });
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
