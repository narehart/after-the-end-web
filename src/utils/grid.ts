import type { GridCell } from '../types/inventory';

export interface CellPosition {
  x: number;
  y: number;
}

export function getCellValue(grid: GridCell, row: number, col: number): string | null {
  const cellRow = grid.cells[row];
  if (cellRow === undefined) return null;
  return cellRow[col] ?? null;
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

export function checkIsOrigin(
  grid: GridCell,
  itemId: string | null,
  col: number,
  row: number,
  renderedItems: Set<string>
): boolean {
  if (itemId === null || renderedItems.has(itemId)) return false;
  const origin = findItemOrigin(grid, itemId);
  if (origin !== null && origin.x === col && origin.y === row) {
    renderedItems.add(itemId);
    return true;
  }
  return false;
}
