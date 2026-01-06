/**
 * Split Item System
 *
 * Splits one item from a stack into a target grid.
 * Creates a new entity with quantity 1.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../world';
import { DEFAULT_QUANTITY, SPLIT_ITEM_FAIL } from '../../constants/inventory';
import type { SplitItemReturn } from '../../types/inventory';
import { findCompatibleStack, getGridEntity, getItemEntity } from '../queries/inventoryQueries';
import { findFreePosition } from '../../utils/findFreePosition';
import { placeItem } from '../../utils/placeItem';
import { generateInstanceId } from '../../utils/generateInstanceId';

interface SplitItemProps {
  entityId: EntityId;
  targetGridId: GridId;
}

interface SplitItemContextProps {
  itemEntity: Entity;
  targetGridEntity: Entity;
}

function validateSplitContext(
  entityId: string,
  targetGridId: string
): SplitItemContextProps | null {
  const itemEntity = getItemEntity({ entityId });
  if (itemEntity?.item === undefined || itemEntity.template === undefined) return null;
  if (itemEntity.item.quantity <= DEFAULT_QUANTITY) return null;

  const targetGridEntity = getGridEntity({ gridId: targetGridId });
  if (targetGridEntity?.grid === undefined) return null;

  return { itemEntity, targetGridEntity };
}

function mergeIntoExistingStack(
  ctx: SplitItemContextProps,
  compatibleStack: Entity
): SplitItemReturn {
  if (compatibleStack.item === undefined || ctx.itemEntity.item === undefined) {
    return SPLIT_ITEM_FAIL;
  }
  compatibleStack.item.quantity += DEFAULT_QUANTITY;
  ctx.itemEntity.item.quantity -= DEFAULT_QUANTITY;
  return { success: true, newEntityId: compatibleStack.id ?? null };
}

function createNewSplitEntity(ctx: SplitItemContextProps, targetGridId: string): SplitItemReturn {
  if (ctx.itemEntity.template === undefined || ctx.targetGridEntity.grid === undefined) {
    return SPLIT_ITEM_FAIL;
  }
  if (ctx.itemEntity.item === undefined) return SPLIT_ITEM_FAIL;

  const { template } = ctx.itemEntity.template;
  const freePos = findFreePosition({
    cells: ctx.targetGridEntity.grid.cells,
    gridWidth: ctx.targetGridEntity.grid.width,
    gridHeight: ctx.targetGridEntity.grid.height,
    itemWidth: template.size.width,
    itemHeight: template.size.height,
  });
  if (freePos === null) return SPLIT_ITEM_FAIL;

  const newEntityId = generateInstanceId(template.neoId);
  const newEntity: Entity = {
    id: newEntityId,
    item: {
      templateId: template.id,
      quantity: DEFAULT_QUANTITY,
      durability: ctx.itemEntity.item.durability,
      maxDurability: ctx.itemEntity.item.maxDurability,
    },
    template: { template },
    position: { gridId: targetGridId, x: freePos.x, y: freePos.y },
  };

  ctx.itemEntity.item.quantity -= DEFAULT_QUANTITY;
  placeItem({
    grid: ctx.targetGridEntity.grid.cells,
    itemId: newEntityId,
    x: freePos.x,
    y: freePos.y,
    width: template.size.width,
    height: template.size.height,
  });
  world.add(newEntity);

  return { success: true, newEntityId };
}

export function splitItem(props: SplitItemProps): SplitItemReturn {
  const { entityId, targetGridId } = props;

  const ctx = validateSplitContext(entityId, targetGridId);
  if (ctx === null) return SPLIT_ITEM_FAIL;
  if (ctx.itemEntity.item === undefined || ctx.itemEntity.template === undefined) {
    return SPLIT_ITEM_FAIL;
  }

  const compatibleStack = findCompatibleStack({
    gridEntity: ctx.targetGridEntity,
    templateId: ctx.itemEntity.item.templateId,
    stackLimit: ctx.itemEntity.template.template.stackLimit,
    addQuantity: DEFAULT_QUANTITY,
    excludeEntityId: entityId,
  });

  if (compatibleStack !== null) {
    return mergeIntoExistingStack(ctx, compatibleStack);
  }

  return createNewSplitEntity(ctx, targetGridId);
}
