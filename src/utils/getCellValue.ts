import type { GridCell } from '../types/inventory';

interface GetCellValueProps {
  grid: GridCell;
  row: number;
  col: number;
}

export function getCellValue(props: GetCellValueProps): string | null {
  const { grid, row, col } = props;
  const cellRow = grid.cells[row];
  if (cellRow === undefined) return null;
  return cellRow[col] ?? null;
}
