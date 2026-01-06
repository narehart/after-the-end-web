import type { GridCell } from '../types/inventory';

export interface IsGridEmptyProps {
  grid: GridCell;
}

export function isGridEmpty(props: IsGridEmptyProps): boolean {
  const { grid } = props;
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell !== null) return false;
    }
  }
  return true;
}
