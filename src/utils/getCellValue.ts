import type { GridCell } from '../types/inventory';

export function getCellValue(grid: GridCell, row: number, col: number): string | null {
  const cellRow = grid.cells[row];
  if (cellRow === undefined) return null;
  return cellRow[col] ?? null;
}
