import { FIRST_INDEX } from '../constants/primitives';
import type { GridOccupancy, GridOccupancyCell } from '../types/inventory';

interface CreateOccupancyGridProps {
  width: number;
  height: number;
}

type CreateOccupancyGridReturn = GridOccupancy;

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
