import type { CellGrid } from '../types/inventory';

export function placeItemInCells(
  cells: CellGrid,
  itemId: string,
  x: number,
  y: number,
  width: number,
  height: number
): CellGrid {
  const newCells = cells.map((row) => [...row]);
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = newCells[y + dy];
      if (row !== undefined) {
        row[x + dx] = itemId;
      }
    }
  }
  return newCells;
}
