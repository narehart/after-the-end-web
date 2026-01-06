import type { StateCreator } from 'zustand';
import { FIRST_INDEX, SECOND_INDEX } from '../../constants/array';
import type { GridCell } from '../../types/inventory';
import type { NavigationSlice, StoreWithGrids } from '../../types/store';
import { getInitialInventoryFocusPath } from '../../utils/getInitialInventoryFocusPath';
import { initialInventoryState } from './itemsSlice';

;

export const createNavigationSlice: StateCreator<
  NavigationSlice & StoreWithGrids,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  inventoryFocusPath: getInitialInventoryFocusPath({
    equipment: initialInventoryState.equipment,
    items: initialInventoryState.items,
  }),
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
      const newPath = state.inventoryFocusPath.slice(FIRST_INDEX, index + SECOND_INDEX);
      set({
        inventoryFocusPath: newPath,
        selectedItemId: null,
      });
    } else {
      const newPath = state.worldFocusPath.slice(FIRST_INDEX, index + SECOND_INDEX);
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
    if (inventoryFocusPath.length === FIRST_INDEX) return null;
    const lastPath = inventoryFocusPath[inventoryFocusPath.length - SECOND_INDEX];
    return lastPath !== undefined ? (grids[lastPath] ?? null) : null;
  },

  getWorldGrid: (): GridCell | null => {
    const { worldFocusPath, grids } = get();
    if (worldFocusPath.length === FIRST_INDEX) return null;
    const lastPath = worldFocusPath[worldFocusPath.length - SECOND_INDEX];
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
