/**
 * Is Space Free
 *
 * Checks if a rectangular area in a grid is free.
 * When entityId is provided, cells matching that ID are considered free.
 * When entityId is omitted, only null cells are considered free.
 */

import type { CellGrid } from '../types/inventory';

interface IsSpaceFreeProps {
  cells: CellGrid;
  x: number;
  y: number;
  width: number;
  height: number;
  entityId?: string | undefined;
}

export function isSpaceFree(props: IsSpaceFreeProps): boolean {
  const { cells, x, y, width, height, entityId } = props;

  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      if (row === undefined) return false;
      const cell = row[x + dx];
      if (cell !== null && cell !== entityId) {
        return false;
      }
    }
  }
  return true;
}
