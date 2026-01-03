import type { GridCell, GridPosition } from '../types/inventory';
import { canPlaceAt } from './canPlaceAt';

export function findFreePosition(
  grid: GridCell,
  itemWidth: number,
  itemHeight: number
): GridPosition | null {
  for (let y = 0; y <= grid.height - itemHeight; y++) {
    for (let x = 0; x <= grid.width - itemWidth; x++) {
      if (canPlaceAt(grid.cells, x, y, itemWidth, itemHeight)) {
        return { x, y };
      }
    }
  }
  return null;
}
