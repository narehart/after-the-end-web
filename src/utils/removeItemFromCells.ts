import type { RemoveItemFromCellsProps, RemoveItemFromCellsReturn } from '../types/utils';

export function removeItemFromCells(props: RemoveItemFromCellsProps): RemoveItemFromCellsReturn {
  const { cells, positions } = props;
  const newCells = cells.map((row) => [...row]);
  for (const pos of positions) {
    const row = newCells[pos.y];
    if (row !== undefined) {
      row[pos.x] = null;
    }
  }
  return newCells;
}
