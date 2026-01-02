import { create } from 'zustand';
import { mockItems } from './mockItems';
import { initialGrids } from './initialGrids';
import { findFreePosition, findItemOrigin } from './gridHelpers';
import { createUnequipAction, createEquipAction } from './equipmentActions';
import {
  createNavigateToContainer,
  createNavigateBack,
  createFocusOnEquipmentSlot,
} from './navigationActions';
import { initialMenu, createMenuActions } from './menuActions';

// Equipment slot types
export const SLOT_TYPES = [
  'helmet',
  'eyes',
  'face',
  'neck',
  'backpack',
  'coat',
  'vest',
  'shirt',
  'rightShoulder',
  'leftShoulder',
  'rightGlove',
  'leftGlove',
  'rightRing',
  'leftRing',
  'rightHolding',
  'leftHolding',
  'pouch',
  'pants',
  'rightShoe',
  'leftShoe',
];

export const SLOT_LABELS = {
  helmet: 'Helmet',
  eyes: 'Eyes',
  face: 'Face',
  neck: 'Neck',
  backpack: 'Backpack',
  coat: 'Coat',
  vest: 'Vest',
  shirt: 'Shirt',
  rightShoulder: 'Right Shoulder',
  leftShoulder: 'Left Shoulder',
  rightGlove: 'Right Glove',
  leftGlove: 'Left Glove',
  rightRing: 'Right Ring',
  leftRing: 'Left Ring',
  rightHolding: 'Right Holding',
  leftHolding: 'Left Holding',
  pouch: 'Pouch',
  pants: 'Pants',
  rightShoe: 'Right Shoe',
  leftShoe: 'Left Shoe',
};

const initialEquipment = {
  helmet: null,
  eyes: 'glasses-1',
  face: null,
  neck: null,
  backpack: 'backpack-1',
  coat: null,
  vest: null,
  shirt: null,
  rightShoulder: null,
  leftShoulder: null,
  rightGlove: null,
  leftGlove: null,
  rightRing: null,
  leftRing: null,
  rightHolding: null,
  leftHolding: null,
  pouch: 'pouch-1',
  pants: null,
  rightShoe: null,
  leftShoe: null,
};

const initialConditions = {
  health: 85,
  hunger: 60,
  thirst: 45,
  temperature: 72,
  encumbrance: 35,
};

export const useInventoryStore = create((set, get) => ({
  equipment: initialEquipment,
  items: mockItems,
  grids: initialGrids,
  inventoryFocusPath: ['backpack-1'],
  worldFocusPath: ['ground'],
  selectedItemId: 'glasses-1',
  focusedEmptySlot: null,
  groundCollapsed: false,
  conditions: initialConditions,
  menu: initialMenu,
  uiScale: 1,
  containerRect: null,

  // Simple setters
  setUIScale: (scale, containerRect = null) => set({ uiScale: scale, containerRect }),
  setSelectedItem: (itemId) => set({ selectedItemId: itemId, focusedEmptySlot: null }),
  setFocusedEmptySlot: (slotType) => set({ focusedEmptySlot: slotType, selectedItemId: null }),
  clearFocusedEmptySlot: () => set({ focusedEmptySlot: null }),
  toggleGroundCollapsed: () => set((state) => ({ groundCollapsed: !state.groundCollapsed })),
  clearInventoryFocusPath: () => set({ inventoryFocusPath: [], selectedItemId: null }),

  closeAllModals: () => set({ menu: initialMenu }),

  // Menu actions (from menuActions.js)
  ...createMenuActions(get, set),

  // Navigation
  navigateToContainer: (containerId, panel, fromEquipment = false) => {
    const result = createNavigateToContainer(get)(containerId, panel, fromEquipment);
    if (result) set(result);
  },

  navigateBack: (index, panel) => {
    const result = createNavigateBack(get)(index, panel);
    if (result) set(result);
  },

  focusOnEquipmentSlot: (slotType) => {
    const result = createFocusOnEquipmentSlot(get)(slotType);
    if (result) set(result);
  },

  // Grid getters
  getInventoryGrid: () => {
    const { inventoryFocusPath, grids } = get();
    if (inventoryFocusPath.length === 0) return null;
    return grids[inventoryFocusPath[inventoryFocusPath.length - 1]] || null;
  },

  getWorldGrid: () => {
    const { worldFocusPath, grids } = get();
    if (worldFocusPath.length === 0) return null;
    return grids[worldFocusPath[worldFocusPath.length - 1]] || null;
  },

  getCurrentGrid: () => get().getInventoryGrid(),
  getGroundGrid: () => get().grids['ground'],

  // Item operations
  rotateItem: (itemId) =>
    set((state) => ({
      items: {
        ...state.items,
        [itemId]: { ...state.items[itemId], rotation: (state.items[itemId].rotation + 90) % 360 },
      },
    })),

  getItemAtPosition: (gridId, x, y) => {
    const { grids, items } = get();
    const grid = grids[gridId];
    if (!grid || y >= grid.height || x >= grid.width) return null;
    const itemId = grid.cells[y][x];
    return itemId ? items[itemId] : null;
  },

  findItemOrigin: (gridId, itemId) => findItemOrigin(get().grids[gridId], itemId),

  findFreePosition: (gridId, itemWidth, itemHeight) =>
    findFreePosition(get().grids[gridId], itemWidth, itemHeight),

  // Equipment operations
  unequipItem: (itemId, targetGridId) => {
    const result = createUnequipAction(get)(itemId, targetGridId);
    if (result) {
      set(result);
      return true;
    }
    return false;
  },

  equipItem: (itemId, targetSlot = null) => {
    const result = createEquipAction(get)(itemId, targetSlot);
    if (result) {
      set(result);
      return true;
    }
    return false;
  },
}));
