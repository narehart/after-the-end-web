import { EMPTY_COUNT } from '../constants/numbers';
import type { GridCell } from '../types/inventory';

export function countGridItems(grid: GridCell | undefined): number {
  if (grid === undefined) return EMPTY_COUNT;
  const uniqueIds = new Set<string>();
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell !== null) {
        uniqueIds.add(cell);
      }
    }
  }
  return uniqueIds.size;
}
