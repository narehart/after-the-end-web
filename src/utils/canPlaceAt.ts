import type { CellGrid } from '../types/inventory';

interface CanPlaceAtProps {
  grid: CellGrid;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function canPlaceAt(props: CanPlaceAtProps): boolean {
  const { grid, x, y, width, height } = props;
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = grid[y + dy];
      if (row === undefined) return false;
      const cell = row[x + dx];
      if (cell !== null) {
        return false;
      }
    }
  }
  return true;
}
