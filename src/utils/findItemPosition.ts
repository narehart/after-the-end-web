/**
 * Find Item Position
 *
 * Finds the position (grid, x, y) of an item in a set of grids.
 */

import type { GridsMap } from '../types/inventory';
import { isOriginCell } from './isOriginCell';

interface FindItemPositionProps {
  itemId: string;
  grids: GridsMap;
}

interface FindItemPositionReturn {
  gridId: string;
  x: number;
  y: number;
}

export function findItemPosition(props: FindItemPositionProps): FindItemPositionReturn | undefined {
  const { itemId, grids } = props;

  for (const [gridId, gridData] of Object.entries(grids)) {
    if (gridData === undefined) continue;
    for (let y = 0; y < gridData.cells.length; y++) {
      const row = gridData.cells[y];
      if (row === undefined) continue;
      for (let x = 0; x < row.length; x++) {
        if (row[x] === itemId && isOriginCell({ cells: gridData.cells, x, y, itemId })) {
          return { gridId, x, y };
        }
      }
    }
  }

  return undefined;
}
