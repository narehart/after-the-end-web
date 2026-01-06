import { FIRST_INDEX } from '../constants/primitives';
import type { CellGrid } from '../types/inventory';

interface PlaceItemProps {
  grid: CellGrid;
  itemId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function placeItem(props: PlaceItemProps): void {
  const { grid, itemId, x, y, width, height } = props;
  for (let dy = FIRST_INDEX; dy < height; dy++) {
    for (let dx = FIRST_INDEX; dx < width; dx++) {
      const row = grid[y + dy];
      const firstRow = grid[FIRST_INDEX];
      if (row !== undefined && firstRow !== undefined && x + dx < firstRow.length) {
        row[x + dx] = itemId;
      }
    }
  }
}
