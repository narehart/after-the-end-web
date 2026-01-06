/**
 * Collect Grids Instance IDs
 *
 * Collects all unique instance IDs from all grids in a GridsMap.
 */

import type { GridsMap } from '../types/inventory';

interface CollectGridsInstanceIdsProps {
  grids: GridsMap;
}

type CollectGridsInstanceIdsReturn = Set<string>;

export function collectGridsInstanceIds(
  props: CollectGridsInstanceIdsProps
): CollectGridsInstanceIdsReturn {
  const { grids } = props;
  const instanceIds = new Set<string>();

  for (const gridData of Object.values(grids)) {
    if (gridData === undefined) continue;
    for (const row of gridData.cells) {
      for (const cellId of row) {
        if (cellId !== null) {
          instanceIds.add(cellId);
        }
      }
    }
  }

  return instanceIds;
}
