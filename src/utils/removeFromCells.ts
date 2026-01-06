/**
 * Remove From Cells
 *
 * Removes an entity from all cells in a grid.
 */

import type { CellGrid } from '../types/inventory';

interface RemoveFromCellsProps {
  cells: CellGrid;
  entityId: string;
}

export function removeFromCells(props: RemoveFromCellsProps): void {
  const { cells, entityId } = props;
  for (const row of cells) {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === entityId) {
        row[x] = null;
      }
    }
  }
}
