import type { MarkGridOccupiedProps } from '../types/utils';

export function markGridOccupied(props: MarkGridOccupiedProps): void {
  const { grid, x, y, itemWidth, itemHeight } = props;
  for (let dy = 0; dy < itemHeight; dy++) {
    for (let dx = 0; dx < itemWidth; dx++) {
      const row = grid[y + dy];
      if (row !== undefined) {
        row[x + dx] = { occupied: true };
      }
    }
  }
}
