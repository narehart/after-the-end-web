import type { GridCell, GridPosition } from '../types/inventory';
import { getCellValue } from './getCellValue';

export function findItemOrigin(grid: GridCell, itemId: string): GridPosition | null {
  for (let row = 0; row < grid.height; row++) {
    for (let col = 0; col < grid.width; col++) {
      if (getCellValue(grid, row, col) === itemId) {
        return { x: col, y: row };
      }
    }
  }
  return null;
}
