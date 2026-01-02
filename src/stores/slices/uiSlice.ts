import type { StateCreator } from 'zustand';
import type {
  SlotType,
  ContainerRect,
  MenuState,
  MenuPathSegment,
  MenuSource,
} from '../../types/inventory';

export interface UIState {
  selectedItemId: string | null;
  focusedEmptySlot: SlotType | null;
  groundCollapsed: boolean;
  uiScale: number;
  containerRect: ContainerRect | null;
  menu: MenuState;
}

export interface UIActions {
  setSelectedItem: (itemId: string | null) => void;
  setFocusedEmptySlot: (slotType: SlotType | null) => void;
  clearFocusedEmptySlot: () => void;
  toggleGroundCollapsed: () => void;
  setUIScale: (scale: number, containerRect?: ContainerRect | null) => void;
  openMenu: (
    position: { x: number; y: number },
    itemId: string | null,
    slotType: SlotType | null,
    source?: MenuSource
  ) => void;
  closeMenu: () => void;
  closeAllModals: () => void;
  menuNavigateTo: (segment: MenuPathSegment) => void;
  menuNavigateBack: () => void;
  menuNavigateToLevel: (level: number) => void;
  menuSetFocusIndex: (index: number) => void;
}

export type UISlice = UIState & UIActions;

export const initialMenu: MenuState = {
  isOpen: false,
  position: null,
  targetItemId: null,
  targetSlotType: null,
  itemId: null,
  source: null,
  path: [],
  focusIndex: 0,
};

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  selectedItemId: 'glasses-1',
  focusedEmptySlot: null,
  groundCollapsed: false,
  uiScale: 1,
  containerRect: null,
  menu: initialMenu,

  setSelectedItem: (itemId): void => {
    set({ selectedItemId: itemId, focusedEmptySlot: null });
  },

  setFocusedEmptySlot: (slotType): void => {
    set({ focusedEmptySlot: slotType, selectedItemId: null });
  },

  clearFocusedEmptySlot: (): void => {
    set({ focusedEmptySlot: null });
  },

  toggleGroundCollapsed: (): void => {
    set((state) => ({ groundCollapsed: !state.groundCollapsed }));
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
        focusIndex: 0,
      },
    });
  },

  closeMenu: (): void => {
    set({ menu: initialMenu });
  },

  closeAllModals: (): void => {
    set({ menu: initialMenu });
  },

  menuNavigateTo: (segment): void => {
    set((state) => ({
      menu: {
        ...state.menu,
        path: [...state.menu.path, segment],
        focusIndex: 0,
      },
    }));
  },

  menuNavigateBack: (): void => {
    set((state) => ({
      menu: {
        ...state.menu,
        path: state.menu.path.slice(0, -1),
        focusIndex: 0,
      },
    }));
  },

  menuNavigateToLevel: (level): void => {
    set((state) => ({
      menu: {
        ...state.menu,
        path: state.menu.path.slice(0, level),
        focusIndex: 0,
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
