import type { GridOccupancy } from '../types/inventory';

interface CheckGridSpotProps {
  grid: GridOccupancy;
  x: number;
  y: number;
  itemWidth: number;
  itemHeight: number;
}

export function checkGridSpot(props: CheckGridSpotProps): boolean {
  const { grid, x, y, itemWidth, itemHeight } = props;
  for (let dy = 0; dy < itemHeight; dy++) {
    for (let dx = 0; dx < itemWidth; dx++) {
      const cell = grid[y + dy]?.[x + dx];
      if (cell === undefined || cell.occupied) {
        return false;
      }
    }
  }
  return true;
}
