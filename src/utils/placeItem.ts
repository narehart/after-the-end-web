import type { PlaceItemProps } from '../types/utils';

export function placeItem(props: PlaceItemProps): void {
  const { grid, itemId, x, y, width, height } = props;
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = grid[y + dy];
      const firstRow = grid[0];
      if (row !== undefined && firstRow !== undefined && x + dx < firstRow.length) {
        row[x + dx] = itemId;
      }
    }
  }
}
