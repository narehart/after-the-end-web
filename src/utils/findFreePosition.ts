/**
 * Find Free Position
 *
 * Finds an available position in a grid where an item can be placed.
 * Returns the first match by default, or a random match if randomize is true.
 */

import type { CellGrid, GridDimensionsProps, ItemDimensionsProps } from '../types/inventory';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/primitives';
import { isSpaceFree } from './isSpaceFree';
import { randomInt } from './randomInt';

interface FindFreePositionProps extends GridDimensionsProps, ItemDimensionsProps {
  cells: CellGrid;
  randomize?: boolean | undefined;
}

interface FindFreePositionReturn {
  x: number;
  y: number;
}

export function findFreePosition(props: FindFreePositionProps): FindFreePositionReturn | null {
  const { cells, gridWidth, gridHeight, itemWidth, itemHeight, randomize } = props;

  if (randomize === true) {
    const positions: FindFreePositionReturn[] = [];
    for (let y = FIRST_INDEX; y <= gridHeight - itemHeight; y++) {
      for (let x = FIRST_INDEX; x <= gridWidth - itemWidth; x++) {
        if (isSpaceFree({ cells, x, y, width: itemWidth, height: itemHeight })) {
          positions.push({ x, y });
        }
      }
    }
    if (positions.length === FIRST_INDEX) return null;
    const index = randomInt({ min: FIRST_INDEX, max: positions.length - SECOND_INDEX });
    return positions[index] ?? null;
  }

  for (let y = 0; y <= gridHeight - itemHeight; y++) {
    for (let x = 0; x <= gridWidth - itemWidth; x++) {
      if (isSpaceFree({ cells, x, y, width: itemWidth, height: itemHeight })) {
        return { x, y };
      }
    }
  }
  return null;
}
