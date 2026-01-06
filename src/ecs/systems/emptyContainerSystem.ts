/**
 * Empty Container System
 *
 * Moves all items from a container grid to the ground grid.
 */

import type { GridId } from '../world';
import { getGridEntity } from '../queries/inventoryQueries';
import { moveItem } from './moveItemSystem';

interface EmptyContainerProps {
  containerId: GridId;
}

export type { EmptyContainerProps };

export function emptyContainer(props: EmptyContainerProps): boolean {
  const { containerId } = props;

  const containerGridEntity = getGridEntity({ gridId: containerId });
  if (containerGridEntity?.grid === undefined) return false;

  // Collect unique item IDs in the container
  const itemIds = new Set<string>();
  for (const row of containerGridEntity.grid.cells) {
    for (const cell of row) {
      if (cell !== null) {
        itemIds.add(cell);
      }
    }
  }

  // Move each item to ground
  for (const itemId of itemIds) {
    const result = moveItem({ entityId: itemId, targetGridId: 'ground' });
    if (!result.success) return false;
  }

  return true;
}
