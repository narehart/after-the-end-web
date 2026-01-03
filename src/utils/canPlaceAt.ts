import type { CellGrid } from '../types/inventory';

export function canPlaceAt(
  cells: CellGrid,
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      if (row === undefined) return false;
      const cell = row[x + dx];
      if (cell !== null) {
        return false;
      }
    }
  }
  return true;
}
