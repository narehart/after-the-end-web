import { FIRST_INDEX, SECOND_INDEX } from '../constants/array';
import type { GridOccupancy } from '../types/ui';
import { checkGridSpot } from './checkGridSpot';
import { randomInt } from './randomInt';

interface FindFreeGridSpotProps {
  grid: GridOccupancy;
  gridWidth: number;
  gridHeight: number;
  itemWidth: number;
  itemHeight: number;
}

export function findFreeGridSpot(props: FindFreeGridSpotProps): { x: number; y: number } | null {
  const { grid, gridWidth, gridHeight, itemWidth, itemHeight } = props;
  const positions: Array<{ x: number; y: number }> = [];

  for (let y = FIRST_INDEX; y <= gridHeight - itemHeight; y++) {
    for (let x = FIRST_INDEX; x <= gridWidth - itemWidth; x++) {
      if (checkGridSpot({ grid, x, y, itemWidth, itemHeight })) {
        positions.push({ x, y });
      }
    }
  }

  if (positions.length === FIRST_INDEX) return null;
  const index = randomInt({ min: FIRST_INDEX, max: positions.length - SECOND_INDEX });
  return positions[index] ?? null;
}
