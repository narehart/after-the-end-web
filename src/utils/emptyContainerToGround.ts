import type { GridsMap, ItemsMap } from '../types/inventory';
import { moveItemInGrid } from './moveItemInGrid';

interface EmptyContainerToGroundProps {
  items: ItemsMap;
  grids: GridsMap;
  containerId: string;
}

interface EmptyContainerToGroundReturn {
  items: ItemsMap;
  grids: GridsMap;
}

export function emptyContainerToGround(
  props: EmptyContainerToGroundProps
): EmptyContainerToGroundReturn | null {
  let { items, grids } = props;
  const { containerId } = props;

  const containerGrid = grids[containerId];
  if (containerGrid === undefined) return null;

  // Get unique item IDs in the container
  const itemIds = new Set<string>();
  for (const row of containerGrid.cells) {
    for (const cell of row) {
      if (cell !== null) {
        itemIds.add(cell);
      }
    }
  }

  // Move each item to ground
  for (const itemId of itemIds) {
    const result = moveItemInGrid({ items, grids, itemId, targetGridId: 'ground' });
    if (result === null) return null;
    items = result.items;
    grids = result.grids;
  }

  return { items, grids };
}
