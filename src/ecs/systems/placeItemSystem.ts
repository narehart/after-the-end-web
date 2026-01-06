/**
 * Place Item System
 *
 * Places an item entity at a specific position in a grid.
 * Used for initial placement or repositioning within same grid.
 */

import type { Entity, EntityId, GridId } from '../../types/ecs';
import {
  getGridEntity,
  getItemEntity,
  placeInCells,
  removeFromCells,
} from '../queries/inventoryQueries';

interface PlaceItemProps {
  entityId: EntityId;
  gridId: GridId;
  x: number;
  y: number;
}

export type { PlaceItemProps };

function isSpaceFree(
  cells: Array<Array<string | null>>,
  x: number,
  y: number,
  width: number,
  height: number,
  entityId: string
): boolean {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      const cell = row?.[x + dx];
      if (cell !== null && cell !== entityId) {
        return false;
      }
    }
  }
  return true;
}

function removeFromOldPosition(itemEntity: Entity, entityId: string): void {
  if (itemEntity.position === undefined) return;
  const oldGridEntity = getGridEntity({ gridId: itemEntity.position.gridId });
  if (oldGridEntity?.grid !== undefined) {
    removeFromCells({ cells: oldGridEntity.grid.cells, entityId });
  }
}

function canPlaceInGrid(
  gridEntity: Entity,
  x: number,
  y: number,
  width: number,
  height: number,
  entityId: string
): boolean {
  if (gridEntity.grid === undefined) return false;
  const outOfBounds = x + width > gridEntity.grid.width || y + height > gridEntity.grid.height;
  if (outOfBounds) return false;
  return isSpaceFree(gridEntity.grid.cells, x, y, width, height, entityId);
}

export function placeItem(props: PlaceItemProps): boolean {
  const { entityId, gridId, x, y } = props;

  const itemEntity = getItemEntity({ entityId });
  if (itemEntity?.template === undefined) return false;

  const gridEntity = getGridEntity({ gridId });
  if (gridEntity?.grid === undefined) return false;

  const { width, height } = itemEntity.template.template.size;
  if (!canPlaceInGrid(gridEntity, x, y, width, height, entityId)) return false;

  removeFromOldPosition(itemEntity, entityId);
  placeInCells({ cells: gridEntity.grid.cells, entityId, x, y, width, height });
  itemEntity.position = { gridId, x, y };

  return true;
}
