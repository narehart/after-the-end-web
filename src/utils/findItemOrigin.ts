import type { GridPosition } from '../types/inventory';
import type { FindItemOriginProps } from '../types/utils';
import { getCellValue } from './getCellValue';

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
