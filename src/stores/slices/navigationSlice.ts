import type { StateCreator } from 'zustand';
import type { GridCell } from '../../types/inventory';
import type { NavigationSlice, StoreWithGrids } from '../../types/store';

export type { NavigationSlice } from '../../types/store';

export const createNavigationSlice: StateCreator<
  NavigationSlice & StoreWithGrids,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  inventoryFocusPath: ['backpack-1'],
  worldFocusPath: ['ground'],

  navigateToContainer: (containerId, panel, fromEquipment = false): void => {
    const state = get();
    const item = state.items[containerId];
    if (item?.gridSize === undefined) return;

    if (panel === 'inventory') {
      const newPath = fromEquipment ? [containerId] : [...state.inventoryFocusPath, containerId];
      set({
        inventoryFocusPath: newPath,
        selectedItemId: containerId,
      });
    } else {
      set({
        worldFocusPath: [...state.worldFocusPath, containerId],
        selectedItemId: containerId,
      });
    }
  },

  navigateBack: (index, panel): void => {
    const state = get();
    if (panel === 'inventory') {
      const newPath = state.inventoryFocusPath.slice(0, index + 1);
      set({
        inventoryFocusPath: newPath,
        selectedItemId: null,
      });
    } else {
      const newPath = state.worldFocusPath.slice(0, index + 1);
      set({
        worldFocusPath: newPath,
        selectedItemId: null,
      });
    }
  },

  focusOnEquipmentSlot: (slotType): void => {
    const state = get();
    const itemId = state.equipment[slotType];
    if (itemId === null) return;

    const item = state.items[itemId];
    if (item?.gridSize === undefined) return;

    set({
      inventoryFocusPath: [itemId],
      selectedItemId: itemId,
    });
  },

  clearInventoryFocusPath: (): void => {
    set({ inventoryFocusPath: [], selectedItemId: null });
  },

  getInventoryGrid: (): GridCell | null => {
    const { inventoryFocusPath, grids } = get();
    if (inventoryFocusPath.length === 0) return null;
    const lastPath = inventoryFocusPath[inventoryFocusPath.length - 1];
    return lastPath !== undefined ? (grids[lastPath] ?? null) : null;
  },

  getWorldGrid: (): GridCell | null => {
    const { worldFocusPath, grids } = get();
    if (worldFocusPath.length === 0) return null;
    const lastPath = worldFocusPath[worldFocusPath.length - 1];
    return lastPath !== undefined ? (grids[lastPath] ?? null) : null;
  },

  getCurrentGrid: (): GridCell | null => get().getInventoryGrid(),

  getGroundGrid: (): GridCell => {
    const ground = get().grids['ground'];
    if (ground === undefined) {
      throw new Error('Ground grid not found');
    }
    return ground;
  },
});
