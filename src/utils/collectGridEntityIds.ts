/**
 * Collect Grid Entity IDs
 *
 * Collects unique entity IDs from a grid's cells.
 */

import type { CellGrid } from '../types/inventory';

interface CollectGridEntityIdsProps {
  cells: CellGrid;
  excludeEntityId?: string | undefined;
}

type CollectGridEntityIdsReturn = Set<string>;

export function collectGridEntityIds(props: CollectGridEntityIdsProps): CollectGridEntityIdsReturn {
  const { cells, excludeEntityId } = props;
  const seenIds = new Set<string>();

  for (const row of cells) {
    for (const cellEntityId of row) {
      if (cellEntityId !== null && cellEntityId !== excludeEntityId) {
        seenIds.add(cellEntityId);
      }
    }
  }
  return seenIds;
}
