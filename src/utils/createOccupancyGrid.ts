import { FIRST_INDEX } from '../constants/array';
import type { GridOccupancyCell } from '../types/ui';
import type { CreateOccupancyGridProps, CreateOccupancyGridReturn } from '../types/randomContainer';

;

export function createOccupancyGrid(props: CreateOccupancyGridProps): CreateOccupancyGridReturn {
  const { width, height } = props;
  const grid: GridOccupancyCell[][] = [];
  for (let y = FIRST_INDEX; y < height; y++) {
    const row: GridOccupancyCell[] = [];
    for (let x = FIRST_INDEX; x < width; x++) {
      row.push({ occupied: false });
    }
    grid.push(row);
  }
  return grid;
}
