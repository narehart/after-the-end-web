import type { GridPosition } from '../types/inventory';
import type { FindFreePositionProps } from '../types/utils';
import { canPlaceAt } from './canPlaceAt';

export function findFreePosition(props: FindFreePositionProps): GridPosition | null {
  const { grid, itemWidth, itemHeight } = props;
  for (let y = 0; y <= grid.height - itemHeight; y++) {
    for (let x = 0; x <= grid.width - itemWidth; x++) {
      if (canPlaceAt({ grid: grid.cells, x, y, width: itemWidth, height: itemHeight })) {
        return { x, y };
      }
    }
  }
  return null;
}
