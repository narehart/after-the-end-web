import type { StateCreator } from 'zustand';
import type { Item, ItemsMap } from '../../types/inventory';
import { toItemType } from '../../utils/toItemType';
import type { ItemsSlice } from '../../types/store';
import type { InitialInventoryState } from '../../types/utils';
import neoItemsArray from '../../data/neoItems.json';
import { buildInitialInventory } from '../../utils/buildInitialInventory';
import { findFreePosition } from '../../utils/findFreePosition';
import { findItemOrigin } from '../../utils/findItemOrigin';

export type { ItemsSlice } from '../../types/store';

function toItem(data: (typeof neoItemsArray)[number]): Item {
  const item: Item = {
    id: data.id,
    neoId: data.neoId,
    type: toItemType(data.type),
    name: data.name,
    description: data.description,
    size: data.size,
    weight: data.weight,
    value: data.value,
    stackLimit: data.stackLimit,
    image: data.image,
    allImages: data.allImages,
  };
  if (data.gridSize !== undefined) {
    item.gridSize = data.gridSize;
  }
  return item;
}

function buildTemplatesMap(): ItemsMap {
  const items: ItemsMap = {};
  for (const data of neoItemsArray) {
    items[data.id] = toItem(data);
  }
  return items;
}

function buildInitialState(): InitialInventoryState {
  const templates = buildTemplatesMap();
  const { grids, instances, equipment } = buildInitialInventory();
  const items: ItemsMap = { ...templates, ...instances };
  return { items, grids, equipment };
}

export const initialInventoryState = buildInitialState();

export const createItemsSlice: StateCreator<ItemsSlice, [], [], ItemsSlice> = (set, get) => ({
  items: initialInventoryState.items,
  grids: initialInventoryState.grids,

  setItems: (items): void => {
    set({ items });
  },

  setGrids: (grids): void => {
    set({ grids });
  },

  // TODO: Rotation is now UI state, needs separate storage
  rotateItem: (): void => {
    // No-op until rotation state is redesigned
  },

  getItemAtPosition: (gridId, x, y): Item | null => {
    const { grids, items } = get();
    const grid = grids[gridId];
    if (grid === undefined || y >= grid.height || x >= grid.width) return null;
    const row = grid.cells[y];
    if (row === undefined) return null;
    const itemId = row[x];
    if (itemId === undefined || itemId === null) return null;
    return items[itemId] ?? null;
  },

  findItemOrigin: (gridId, itemId): { x: number; y: number } | null => {
    const grid = get().grids[gridId];
    if (grid === undefined) return null;
    return findItemOrigin({ grid, itemId });
  },

  findFreePosition: (gridId, itemWidth, itemHeight): { x: number; y: number } | null => {
    const grid = get().grids[gridId];
    if (grid === undefined) return null;
    return findFreePosition({ grid, itemWidth, itemHeight });
  },
});
