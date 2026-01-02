import type { GridCell } from '../types/inventory';
import { getCellValue } from './getCellValue';

export interface CellPosition {
  x: number;
  y: number;
}

export function findItemOrigin(grid: GridCell, itemId: string): CellPosition | null {
  for (let row = 0; row < grid.height; row++) {
    for (let col = 0; col < grid.width; col++) {
      if (getCellValue(grid, row, col) === itemId) {
        return { x: col, y: row };
      }
    }
  }
  return null;
}
