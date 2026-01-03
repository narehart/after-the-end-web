import type { GetCellValueProps } from '../types/utils';

export function getCellValue(props: GetCellValueProps): string | null {
  const { grid, row, col } = props;
  const cellRow = grid.cells[row];
  if (cellRow === undefined) return null;
  return cellRow[col] ?? null;
}
