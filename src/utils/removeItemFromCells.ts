import type { CellGrid, GridPosition } from '../types/inventory';

export function removeItemFromCells(cells: CellGrid, positions: GridPosition[]): CellGrid {
  const newCells = cells.map((row) => [...row]);
  for (const pos of positions) {
    const row = newCells[pos.y];
    if (row !== undefined) {
      row[pos.x] = null;
    }
  }
  return newCells;
}
