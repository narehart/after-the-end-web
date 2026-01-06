/**
 * Find Free Position
 *
 * Finds the first available position in a grid where an item can be placed.
 */

import type { CellGrid } from '../types/inventory';
import { canPlaceAt } from './canPlaceAt';

interface FindFreePositionProps {
  cells: CellGrid;
  gridWidth: number;
  gridHeight: number;
  itemWidth: number;
  itemHeight: number;
}

interface FindFreePositionReturn {
  x: number;
  y: number;
}

export function findFreePosition(props: FindFreePositionProps): FindFreePositionReturn | null {
  const { cells, gridWidth, gridHeight, itemWidth, itemHeight } = props;

  for (let y = 0; y <= gridHeight - itemHeight; y++) {
    for (let x = 0; x <= gridWidth - itemWidth; x++) {
      if (canPlaceAt({ grid: cells, x, y, width: itemWidth, height: itemHeight })) {
        return { x, y };
      }
    }
  }
  return null;
}
