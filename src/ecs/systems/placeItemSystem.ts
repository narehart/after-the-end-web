/**
 * Place Item System
 *
 * Places an item entity at a specific position in a grid.
 * Used for initial placement or repositioning within same grid.
 */

import type { Entity, EntityId, GridId } from '../world';
import { getGridEntity, getItemEntity } from '../queries/inventoryQueries';
import { placeItem as placeItemInGrid } from '../../utils/placeItem';
import { removeFromCells } from '../../utils/removeFromCells';
import { canPlaceInGrid } from '../../utils/canPlaceInGrid';

interface PlaceItemProps {
  entityId: EntityId;
  gridId: GridId;
  x: number;
  y: number;
}

export type { PlaceItemProps };

function removeFromOldPosition(itemEntity: Entity, entityId: string): void {
  if (itemEntity.position === undefined) return;
  const oldGridEntity = getGridEntity({ gridId: itemEntity.position.gridId });
  if (oldGridEntity?.grid !== undefined) {
    removeFromCells({ cells: oldGridEntity.grid.cells, entityId });
  }
}

export function placeItem(props: PlaceItemProps): boolean {
  const { entityId, gridId, x, y } = props;

  const itemEntity = getItemEntity({ entityId });
  if (itemEntity?.template === undefined) return false;

  const gridEntity = getGridEntity({ gridId });
  if (gridEntity?.grid === undefined) return false;

  const { width, height } = itemEntity.template.template.size;
  if (!canPlaceInGrid({ gridEntity, x, y, width, height, entityId })) return false;

  removeFromOldPosition(itemEntity, entityId);
  placeItemInGrid({ grid: gridEntity.grid.cells, itemId: entityId, x, y, width, height });
  itemEntity.position = { gridId, x, y };

  return true;
}
