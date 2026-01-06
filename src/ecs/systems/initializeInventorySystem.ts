/**
 * Initialize Inventory System
 *
 * Populates the ECS world with initial inventory state.
 * Generates inventory directly from item templates and game logic.
 */

import { world } from '../world';
import type { Entity } from '../world';
import type { Equipment } from '../../types/equipment';
import type { GridsMap, ItemsMap, Item } from '../../types/inventory';
import { itemTemplates } from '../../utils/itemTemplates';
import { placeItem } from '../../utils/placeItem';
import { createEmptyGrid } from '../../utils/createEmptyGrid';
import { collectGridsInstanceIds } from '../../utils/collectGridsInstanceIds';
import { findItemPosition } from '../../utils/findItemPosition';
import { buildItemEntity } from '../../utils/buildItemEntity';
import { buildInitialInventory } from '../../utils/buildInitialInventory';

let ecsInitialized = false;

interface InitializeInventoryProps {
  items: ItemsMap;
  grids: GridsMap;
  equipment: Equipment;
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
        cells: createEmptyGrid({ width: gridData.width, height: gridData.height }),
      },
    };
    world.add(entity);
  }
}

interface PlaceItemInGridProps {
  itemId: string;
  item: Item;
  position: { gridId: string; x: number; y: number };
}

function placeItemInGrid(props: PlaceItemInGridProps): void {
  const { itemId, item, position } = props;
  const gridEntity = world.where((e) => e.grid?.gridId === position.gridId).first;
  if (gridEntity?.grid === undefined) return;

  placeItem({
    grid: gridEntity.grid.cells,
    itemId,
    x: position.x,
    y: position.y,
    width: item.size.width,
    height: item.size.height,
  });
}

function createItemEntities(items: ItemsMap, grids: GridsMap): void {
  const instanceIds = collectGridsInstanceIds({ grids });

  for (const [itemId, item] of Object.entries(items)) {
    if (item === undefined) continue;
    if (!instanceIds.has(itemId)) continue;

    const position = findItemPosition({ itemId, grids });
    const entity = buildItemEntity({ itemId, item, position });
    world.add(entity);

    if (position !== undefined) {
      placeItemInGrid({ itemId, item, position });
    }
  }
}

function createEquippedItemEntities(equipment: Equipment, items: ItemsMap): void {
  for (const equippedId of Object.values(equipment)) {
    if (equippedId === null) continue;
    const item = items[equippedId];
    if (item === undefined) continue;

    const entity = buildItemEntity({ itemId: equippedId, item, position: undefined });
    world.add(entity);
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
  createEquippedItemEntities(equipment, items);
  createEquipmentEntity(equipment);
}

/**
 * Ensures ECS world is initialized with inventory data.
 * Safe to call multiple times - only initializes once.
 * Called at module load to ensure data is ready before first render.
 */
function ensureInitialized(): void {
  if (ecsInitialized) return;
  ecsInitialized = true;

  // Clear world before initializing
  for (const entity of world.entities) {
    world.remove(entity);
  }

  // Generate initial inventory directly (not from Zustand)
  const { grids, instances, equipment } = buildInitialInventory();

  // Merge templates with instances for item lookup
  const items: ItemsMap = { ...itemTemplates, ...instances };

  initializeInventory({ items, grids, equipment });
}

// Initialize ECS world synchronously at module load
ensureInitialized();
