/**
 * Can Place In Grid
 *
 * Checks if an item can be placed at a position in a grid.
 */

import type { Entity } from '../ecs/world';
import { isSpaceFree } from './isSpaceFree';

interface CanPlaceInGridProps {
  gridEntity: Entity;
  x: number;
  y: number;
  width: number;
  height: number;
  entityId: string;
}

export function canPlaceInGrid(props: CanPlaceInGridProps): boolean {
  const { gridEntity, x, y, width, height, entityId } = props;

  if (gridEntity.grid === undefined) return false;
  const outOfBounds = x + width > gridEntity.grid.width || y + height > gridEntity.grid.height;
  if (outOfBounds) return false;
  return isSpaceFree({ cells: gridEntity.grid.cells, x, y, width, height, entityId });
}
