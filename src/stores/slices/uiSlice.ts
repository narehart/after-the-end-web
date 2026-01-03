import type { StateCreator } from 'zustand';
import { FIRST_INDEX, NOT_FOUND_INDEX, DEFAULT_SCALE } from '../../constants/numbers';
import type { UISlice } from '../../types/store';
import { INITIAL_MENU } from '../../constants/ui';

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  selectedItemId: 'glasses-1',
  focusedEmptySlot: null,
  uiScale: DEFAULT_SCALE,
  containerRect: null,
  menu: INITIAL_MENU,

  setSelectedItem: (itemId): void => {
    set({ selectedItemId: itemId, focusedEmptySlot: null });
  },

  setFocusedEmptySlot: (slotType): void => {
    set({ focusedEmptySlot: slotType, selectedItemId: null });
  },

  clearFocusedEmptySlot: (): void => {
    set({ focusedEmptySlot: null });
  },

  setUIScale: (scale, containerRect = null): void => {
    set({ uiScale: scale, containerRect });
  },

  openMenu: (position, itemId, slotType, source = null): void => {
    set({
      menu: {
        isOpen: true,
        position,
        targetItemId: itemId,
        targetSlotType: slotType,
        itemId,
        source,
        path: [],
        focusIndex: FIRST_INDEX,
      },
    });
  },

  closeMenu: (): void => {
    set({ menu: INITIAL_MENU });
  },

  closeAllModals: (): void => {
    set({ menu: INITIAL_MENU });
  },

  menuNavigateTo: (segment): void => {
    set((state) => ({
      menu: {
        ...state.menu,
        path: [...state.menu.path, segment],
        focusIndex: FIRST_INDEX,
      },
    }));
  },

  menuNavigateBack: (): void => {
    set((state) => ({
      menu: {
        ...state.menu,
        path: state.menu.path.slice(FIRST_INDEX, NOT_FOUND_INDEX),
        focusIndex: FIRST_INDEX,
      },
    }));
  },

  menuNavigateToLevel: (level): void => {
    set((state) => ({
      menu: {
        ...state.menu,
        path: state.menu.path.slice(FIRST_INDEX, level),
        focusIndex: FIRST_INDEX,
      },
    }));
  },

  menuSetFocusIndex: (index): void => {
    set((state) => ({
      menu: {
        ...state.menu,
        focusIndex: index,
      },
    }));
  },
});
