import { FIRST_INDEX } from '../constants/array';
import type { GridPosition } from '../types/inventory';
import type { ItemLocation } from '../types/ui';
import type { FindItemInGridsProps } from '../types/utils';

;

export function findItemInGrids(props: FindItemInGridsProps): ItemLocation | null {
  const { grids, itemId } = props;
  for (const [gridId, grid] of Object.entries(grids)) {
    if (grid === undefined) continue;
    const positions: GridPosition[] = [];
    for (let y = FIRST_INDEX; y < grid.height; y++) {
      for (let x = FIRST_INDEX; x < grid.width; x++) {
        const row = grid.cells[y];
        if (row?.[x] === itemId) {
          positions.push({ x, y });
        }
      }
    }
    if (positions.length > FIRST_INDEX) {
      return { gridId, positions };
    }
  }
  return null;
}
