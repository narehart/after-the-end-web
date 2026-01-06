/**
 * Inventory Queries
 *
 * Helper functions for querying ECS entities related to inventory.
 * All functions in this file must reference the ECS world.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../world';
import type { Equipment } from '../../types/equipment';
import { INITIAL_EQUIPMENT } from '../../constants/equipment';
import { collectGridEntityIds } from '../../utils/collectGridEntityIds';
import { isStackCompatible } from '../../utils/isStackCompatible';

// --- ECS Entity Queries ---

interface GetGridEntityProps {
  gridId: GridId;
}

export function getGridEntity(props: GetGridEntityProps): Entity | undefined {
  const { gridId } = props;
  for (const entity of world) {
    if (entity.grid?.gridId === gridId) {
      return entity;
    }
  }
  return undefined;
}

interface GetItemEntityProps {
  entityId: EntityId;
}

export function getItemEntity(props: GetItemEntityProps): Entity | undefined {
  const { entityId } = props;
  for (const entity of world) {
    if (entity.id === entityId) {
      return entity;
    }
  }
  return undefined;
}

interface FindCompatibleStackProps {
  gridEntity: Entity;
  templateId: string;
  stackLimit: number;
  addQuantity: number;
  excludeEntityId?: EntityId;
}

export function findCompatibleStack(props: FindCompatibleStackProps): Entity | null {
  const { gridEntity, templateId, stackLimit, addQuantity, excludeEntityId } = props;
  if (gridEntity.grid === undefined) return null;

  const targetIds = collectGridEntityIds({ cells: gridEntity.grid.cells, excludeEntityId });

  for (const entity of world) {
    if (entity.id === undefined || !targetIds.has(entity.id)) continue;
    if (entity.item === undefined) continue;

    const compatible = isStackCompatible({
      itemTemplateId: entity.item.templateId,
      itemQuantity: entity.item.quantity,
      targetTemplateId: templateId,
      stackLimit,
      addQuantity,
    });
    if (compatible) return entity;
  }

  return null;
}

interface GetEquipmentReturn {
  equipment: Equipment;
}

export function getEquipment(): GetEquipmentReturn {
  for (const entity of world) {
    if (entity.equipment !== undefined) {
      return { equipment: entity.equipment.slots };
    }
  }
  return { equipment: { ...INITIAL_EQUIPMENT } };
}

type GetLargestEquippedContainerReturn = string | null;

export function getLargestEquippedContainer(): GetLargestEquippedContainerReturn {
  const { equipment } = getEquipment();
  let largestId: string | null = null;
  let largestSize = 0;

  for (const itemId of Object.values(equipment)) {
    if (itemId === null) continue;

    // Find the item entity to check gridSize
    for (const entity of world) {
      if (entity.id === itemId && entity.template?.template.gridSize !== undefined) {
        const { width, height } = entity.template.template.gridSize;
        const size = width * height;
        if (size > largestSize) {
          largestSize = size;
          largestId = itemId;
        }
        break;
      }
    }
  }

  return largestId;
}
