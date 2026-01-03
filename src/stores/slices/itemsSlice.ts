import type { StateCreator } from 'zustand';
import type { Item, ItemsMap } from '../../types/inventory';
import type { ItemsSlice } from '../../types/store';
import mockItemsJson from '../../data/mockItems.json';
import { initialGrids } from '../../constants/initialGrids';
import { findFreePosition } from '../../utils/findFreePosition';
import { findItemOrigin } from '../../utils/findItemOrigin';

export type { ItemsSlice } from '../../types/store';

const mockItems = mockItemsJson as ItemsMap;

export const createItemsSlice: StateCreator<ItemsSlice, [], [], ItemsSlice> = (set, get) => ({
  items: mockItems,
  grids: initialGrids,

  setItems: (items): void => {
    set({ items });
  },

  setGrids: (grids): void => {
    set({ grids });
  },

  rotateItem: (itemId): void => {
    set((state) => {
      const item = state.items[itemId];
      if (item === undefined) return state;
      return {
        items: {
          ...state.items,
          [itemId]: { ...item, rotation: (item.rotation + 90) % 360 },
        },
      };
    });
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
