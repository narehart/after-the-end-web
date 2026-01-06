/**
 * Destroy Item System
 *
 * Removes an item entity from its grid and the world.
 */

import { world } from '../world';
import type { DestroyItemProps } from '../../types/ecs';
import { getGridEntity, getItemEntity, removeFromCells } from '../queries/inventoryQueries';

export function destroyItem(props: DestroyItemProps): boolean {
  const { entityId } = props;

  const itemEntity = getItemEntity({ entityId });
  if (itemEntity === undefined) {
    return false;
  }

  // Remove from grid if positioned
  if (itemEntity.position !== undefined) {
    const gridEntity = getGridEntity({ gridId: itemEntity.position.gridId });
    if (gridEntity?.grid !== undefined) {
      removeFromCells({ cells: gridEntity.grid.cells, entityId });
    }
  }

  world.remove(itemEntity);
  return true;
}
