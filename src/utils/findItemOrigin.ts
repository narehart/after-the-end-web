import type { GridCell, GridPosition } from '../types/inventory';
import { getCellValue } from './getCellValue';

interface FindItemOriginProps {
  grid: GridCell;
  itemId: string;
}

export function findItemOrigin(props: FindItemOriginProps): GridPosition | null {
  const { grid, itemId } = props;
  for (let row = 0; row < grid.height; row++) {
    for (let col = 0; col < grid.width; col++) {
      if (getCellValue({ grid, row, col }) === itemId) {
        return { x: col, y: row };
      }
    }
  }
  return null;
}
