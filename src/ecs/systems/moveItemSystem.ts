/**
 * Move Item System
 *
 * Moves an item entity from its current grid to a target grid.
 * Will merge into compatible stack if possible.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../world';
import { MOVE_ITEM_FAIL } from '../../constants/inventory';
import type { MoveItemReturn } from '../../types/inventory';
import { findCompatibleStack, getGridEntity, getItemEntity } from '../queries/inventoryQueries';
import { findFreePosition } from '../../utils/findFreePosition';
import { placeItem } from '../../utils/placeItem';
import { removeFromCells } from '../../utils/removeFromCells';

interface MoveItemProps {
  entityId: EntityId;
  targetGridId: GridId;
}

interface MoveItemContextProps {
  itemEntity: Entity;
  sourceGridEntity: Entity;
  targetGridEntity: Entity;
}

function validateMoveContext(entityId: string, targetGridId: string): MoveItemContextProps | null {
  const itemEntity = getItemEntity({ entityId });
  if (itemEntity?.item === undefined || itemEntity.template === undefined) return null;
  if (itemEntity.position === undefined || itemEntity.position.gridId === targetGridId) return null;

  const sourceGridEntity = getGridEntity({ gridId: itemEntity.position.gridId });
  const targetGridEntity = getGridEntity({ gridId: targetGridId });
  if (sourceGridEntity?.grid === undefined || targetGridEntity?.grid === undefined) return null;

  return { itemEntity, sourceGridEntity, targetGridEntity };
}

function mergeIntoStack(
  ctx: MoveItemContextProps,
  compatibleStack: Entity,
  entityId: string
): MoveItemReturn {
  if (compatibleStack.item === undefined || ctx.itemEntity.item === undefined)
    return MOVE_ITEM_FAIL;
  if (ctx.sourceGridEntity.grid === undefined) return MOVE_ITEM_FAIL;

  compatibleStack.item.quantity += ctx.itemEntity.item.quantity;
  removeFromCells({ cells: ctx.sourceGridEntity.grid.cells, entityId });
  world.remove(ctx.itemEntity);
  return { success: true, merged: true };
}

export function moveItem(props: MoveItemProps): MoveItemReturn {
  const { entityId, targetGridId } = props;

  const ctx = validateMoveContext(entityId, targetGridId);
  if (ctx === null) return MOVE_ITEM_FAIL;
  if (ctx.itemEntity.item === undefined || ctx.itemEntity.template === undefined) {
    return MOVE_ITEM_FAIL;
  }

  const compatibleStack = findCompatibleStack({
    gridEntity: ctx.targetGridEntity,
    templateId: ctx.itemEntity.item.templateId,
    stackLimit: ctx.itemEntity.template.template.stackLimit,
    addQuantity: ctx.itemEntity.item.quantity,
  });

  if (compatibleStack !== null) {
    return mergeIntoStack(ctx, compatibleStack, entityId);
  }

  // Move to new position in target grid
  if (ctx.targetGridEntity.grid === undefined || ctx.sourceGridEntity.grid === undefined) {
    return MOVE_ITEM_FAIL;
  }

  const { template } = ctx.itemEntity.template;
  const freePos = findFreePosition({
    cells: ctx.targetGridEntity.grid.cells,
    gridWidth: ctx.targetGridEntity.grid.width,
    gridHeight: ctx.targetGridEntity.grid.height,
    itemWidth: template.size.width,
    itemHeight: template.size.height,
  });
  if (freePos === null) return MOVE_ITEM_FAIL;

  removeFromCells({ cells: ctx.sourceGridEntity.grid.cells, entityId });
  placeItem({
    grid: ctx.targetGridEntity.grid.cells,
    itemId: entityId,
    x: freePos.x,
    y: freePos.y,
    width: template.size.width,
    height: template.size.height,
  });

  if (ctx.itemEntity.position !== undefined) {
    ctx.itemEntity.position.gridId = targetGridId;
    ctx.itemEntity.position.x = freePos.x;
    ctx.itemEntity.position.y = freePos.y;
  }
  return { success: true, merged: false };
}
