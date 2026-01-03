import type { CellGrid } from '../types/inventory';

export function placeItem(
  cells: CellGrid,
  itemId: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      const firstRow = cells[0];
      if (row !== undefined && firstRow !== undefined && x + dx < firstRow.length) {
        row[x + dx] = itemId;
      }
    }
  }
}
