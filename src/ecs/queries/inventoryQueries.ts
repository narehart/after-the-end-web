/**
 * Inventory Queries
 *
 * Helper functions for querying ECS entities related to inventory.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../world';
import type { Equipment } from '../../types/inventory';
import { INITIAL_EQUIPMENT } from '../../constants/equipment';

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

function isCompatibleStack(
  itemEntity: Entity,
  templateId: string,
  stackLimit: number,
  addQuantity: number
): boolean {
  if (itemEntity.item === undefined) return false;
  const isMatch = itemEntity.item.templateId === templateId;
  const hasRoom = itemEntity.item.quantity + addQuantity <= stackLimit;
  return isMatch && hasRoom;
}

export function findCompatibleStack(props: FindCompatibleStackProps): Entity | null {
  const { gridEntity, templateId, stackLimit, addQuantity, excludeEntityId } = props;
  if (gridEntity.grid === undefined) return null;

  const { cells } = gridEntity.grid;
  const seenIds = new Set<EntityId>();

  for (const row of cells) {
    for (const cellEntityId of row) {
      if (cellEntityId === null || seenIds.has(cellEntityId)) continue;
      if (cellEntityId === excludeEntityId) continue;
      seenIds.add(cellEntityId);

      const itemEntity = getItemEntity({ entityId: cellEntityId });
      if (
        itemEntity !== undefined &&
        isCompatibleStack(itemEntity, templateId, stackLimit, addQuantity)
      ) {
        return itemEntity;
      }
    }
  }

  return null;
}

interface FindFreePositionProps {
  cells: Array<Array<EntityId | null>>;
  gridWidth: number;
  gridHeight: number;
  itemWidth: number;
  itemHeight: number;
}

interface FindFreePositionReturn {
  x: number;
  y: number;
}

function canPlaceAt(
  cells: Array<Array<EntityId | null>>,
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      if (row?.[x + dx] !== null) {
        return false;
      }
    }
  }
  return true;
}

export function findFreePosition(props: FindFreePositionProps): FindFreePositionReturn | null {
  const { cells, gridWidth, gridHeight, itemWidth, itemHeight } = props;

  for (let y = 0; y <= gridHeight - itemHeight; y++) {
    for (let x = 0; x <= gridWidth - itemWidth; x++) {
      if (canPlaceAt(cells, x, y, itemWidth, itemHeight)) {
        return { x, y };
      }
    }
  }
  return null;
}

interface PlaceInCellsProps {
  cells: Array<Array<EntityId | null>>;
  entityId: EntityId;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function placeInCells(props: PlaceInCellsProps): void {
  const { cells, entityId, x, y, width, height } = props;
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      if (row !== undefined) {
        row[x + dx] = entityId;
      }
    }
  }
}

interface RemoveFromCellsProps {
  cells: Array<Array<EntityId | null>>;
  entityId: EntityId;
}

export function removeFromCells(props: RemoveFromCellsProps): void {
  const { cells, entityId } = props;
  for (const row of cells) {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === entityId) {
        row[x] = null;
      }
    }
  }
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
