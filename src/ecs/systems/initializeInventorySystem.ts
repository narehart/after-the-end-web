/**
 * Initialize Inventory System
 *
 * Populates the ECS world with initial inventory state.
 * Converts from the legacy Zustand format to ECS entities.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../../types/ecs';
import type { GridsMap, ItemsMap, Equipment, Item } from '../../types/inventory';
import { placeInCells } from '../queries/inventoryQueries';
import { FIRST_INDEX, SECOND_INDEX } from '../../constants/array';
import { DEFAULT_QUANTITY } from '../../constants/items';

interface InitializeInventoryProps {
  items: ItemsMap;
  grids: GridsMap;
  equipment: Equipment;
}

interface FindPositionReturn {
  gridId: GridId;
  x: number;
  y: number;
}

function createEmptyCells(width: number, height: number): Array<Array<EntityId | null>> {
  const cells: Array<Array<EntityId | null>> = [];
  for (let y = 0; y < height; y++) {
    const row: Array<EntityId | null> = [];
    for (let x = 0; x < width; x++) {
      row.push(null);
    }
    cells.push(row);
  }
  return cells;
}

function createGridEntities(grids: GridsMap): void {
  for (const [gridId, gridData] of Object.entries(grids)) {
    if (gridData === undefined) continue;
    const entity: Entity = {
      id: gridId,
      grid: {
        gridId,
        width: gridData.width,
        height: gridData.height,
        cells: createEmptyCells(gridData.width, gridData.height),
      },
    };
    world.add(entity);
  }
}

function collectInstanceIds(grids: GridsMap): Set<string> {
  const instanceIds = new Set<string>();
  for (const gridData of Object.values(grids)) {
    if (gridData === undefined) continue;
    for (const row of gridData.cells) {
      for (const cellId of row) {
        if (cellId !== null) {
          instanceIds.add(cellId);
        }
      }
    }
  }
  return instanceIds;
}

function isOriginCell(
  gridData: { cells: Array<Array<string | null>> },
  x: number,
  y: number,
  itemId: string
): boolean {
  const row = gridData.cells[y];
  if (row === undefined) return false;

  const isLeftEdge = x === FIRST_INDEX || row[x - SECOND_INDEX] !== itemId;
  const rowAbove = gridData.cells[y - SECOND_INDEX];
  const cellAbove = rowAbove?.[x];
  const isTopEdge = y === FIRST_INDEX || cellAbove !== itemId;

  return isLeftEdge && isTopEdge;
}

function findItemPosition(itemId: string, grids: GridsMap): FindPositionReturn | undefined {
  for (const [gridId, gridData] of Object.entries(grids)) {
    if (gridData === undefined) continue;
    for (let y = 0; y < gridData.cells.length; y++) {
      const row = gridData.cells[y];
      if (row === undefined) continue;
      for (let x = 0; x < row.length; x++) {
        if (row[x] === itemId && isOriginCell(gridData, x, y, itemId)) {
          return { gridId, x, y };
        }
      }
    }
  }
  return undefined;
}

function createItemEntity(
  itemId: string,
  item: Item,
  position: FindPositionReturn | undefined
): Entity {
  const entity: Entity = {
    id: itemId,
    item: {
      templateId: item.id,
      quantity: item.quantity ?? DEFAULT_QUANTITY,
      durability: item.durability ?? null,
      maxDurability: null,
    },
    template: { template: item },
  };

  if (position !== undefined) {
    entity.position = position;
  }

  if (item.gridSize !== undefined) {
    entity.container = { gridEntityId: `${itemId}-grid` };
  }

  return entity;
}

function placeItemInGrid(itemId: string, item: Item, position: FindPositionReturn): void {
  const gridEntity = world.where((e) => e.grid?.gridId === position.gridId).first;
  if (gridEntity?.grid === undefined) return;

  placeInCells({
    cells: gridEntity.grid.cells,
    entityId: itemId,
    x: position.x,
    y: position.y,
    width: item.size.width,
    height: item.size.height,
  });
}

function createItemEntities(items: ItemsMap, grids: GridsMap): void {
  const instanceIds = collectInstanceIds(grids);

  for (const [itemId, item] of Object.entries(items)) {
    if (item === undefined) continue;
    if (!instanceIds.has(itemId)) continue;

    const position = findItemPosition(itemId, grids);
    const entity = createItemEntity(itemId, item, position);
    world.add(entity);

    if (position !== undefined) {
      placeItemInGrid(itemId, item, position);
    }
  }
}

function createEquipmentEntity(equipment: Equipment): void {
  const entity: Entity = {
    id: 'player-equipment',
    equipment: { slots: equipment },
  };
  world.add(entity);
}

export function initializeInventory(props: InitializeInventoryProps): void {
  const { items, grids, equipment } = props;

  for (const entity of world.entities) {
    world.remove(entity);
  }

  createGridEntities(grids);
  createItemEntities(items, grids);
  createEquipmentEntity(equipment);
}
