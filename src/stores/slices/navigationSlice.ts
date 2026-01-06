import type { StateCreator } from 'zustand';
import { FIRST_INDEX, SECOND_INDEX } from '../../constants/array';
import type { NavigationSlice, StoreWithEquipment } from '../../types/store';
import { getLargestEquippedContainer } from '../../ecs/queries/inventoryQueries';

function getInitialContainerPath(): string[] {
  const containerId = getLargestEquippedContainer();
  return containerId !== null ? [containerId] : [];
}

export const createNavigationSlice: StateCreator<
  NavigationSlice & StoreWithEquipment,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  inventoryFocusPath: getInitialContainerPath(),
  worldFocusPath: ['ground'],

  navigateToContainer: (containerId, panel, fromEquipment = false): void => {
    // Caller is responsible for verifying item has gridSize before calling
    const state = get();
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
    // Caller is responsible for verifying item has gridSize before calling
    const state = get();
    const itemId = state.equipment[slotType];
    if (itemId === null) return;

    set({
      inventoryFocusPath: [itemId],
      selectedItemId: itemId,
    });
  },

  clearInventoryFocusPath: (): void => {
    set({ inventoryFocusPath: [], selectedItemId: null });
  },
});
