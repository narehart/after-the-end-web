import type { GridPosition } from '../types/inventory';
import type { ItemLocation } from '../types/ui';
import type { FindItemInGridsProps } from '../types/utils';

export type { ItemLocation } from '../types/ui';

export function findItemInGrids(props: FindItemInGridsProps): ItemLocation | null {
  const { grids, itemId } = props;
  for (const [gridId, grid] of Object.entries(grids)) {
    if (grid === undefined) continue;
    const positions: GridPosition[] = [];
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const row = grid.cells[y];
        if (row?.[x] === itemId) {
          positions.push({ x, y });
        }
      }
    }
    if (positions.length > 0) {
      return { gridId, positions };
    }
  }
  return null;
}
