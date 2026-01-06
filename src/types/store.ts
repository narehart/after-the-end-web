import type {
  Conditions,
  ContainerRect,
  Equipment,
  GridCell,
  GridsMap,
  Item,
  ItemsMap,
  MenuPathSegment,
  MenuSource,
  MenuState,
  SlotType,
} from './inventory';

// Conditions Slice
interface ConditionsState {
  conditions: Conditions;
}

interface ConditionsActions {
  setConditions: (conditions: Conditions) => void;
  updateCondition: (key: keyof Conditions, value: number) => void;
}

export type ConditionsSlice = ConditionsState & ConditionsActions;

// Equipment Slice
interface EquipmentState {
  equipment: Equipment;
}

interface EquipmentActions {
  setEquipment: (equipment: Equipment) => void;
  setEquipmentSlot: (slot: SlotType, itemId: string | null) => void;
}

export type EquipmentSlice = EquipmentState & EquipmentActions;

// Equipment Actions Slice
export interface EquipmentActionsSlice {
  unequipItem: (itemId: string, targetGridId: string) => boolean;
  equipItem: (itemId: string, targetSlot?: SlotType | null) => boolean;
  moveItem: (itemId: string, targetGridId: string) => boolean;
  splitItem: (itemId: string, targetGridId: string) => boolean;
  destroyItem: (itemId: string) => boolean;
  emptyContainer: (containerId: string) => boolean;
}

export interface StoreWithEquipment {
  equipment: Equipment;
  items: ItemsMap;
  grids: GridsMap;
  inventoryFocusPath: string[];
  selectedItemId: string | null;
}

// Items Slice
interface ItemsState {
  items: ItemsMap;
  grids: GridsMap;
}

interface ItemsActions {
  setItems: (items: ItemsMap) => void;
  setGrids: (grids: GridsMap) => void;
  rotateItem: (itemId: string) => void;
  getItemAtPosition: (gridId: string, x: number, y: number) => Item | null;
  findItemOrigin: (gridId: string, itemId: string) => { x: number; y: number } | null;
  findFreePosition: (
    gridId: string,
    itemWidth: number,
    itemHeight: number
  ) => { x: number; y: number } | null;
}

export type ItemsSlice = ItemsState & ItemsActions;

// Navigation Slice
interface NavigationState {
  inventoryFocusPath: string[];
  worldFocusPath: string[];
}

interface NavigationActions {
  navigateToContainer: (containerId: string, panel: string, fromEquipment?: boolean) => void;
  navigateBack: (index: number, panel: string) => void;
  focusOnEquipmentSlot: (slotType: SlotType) => void;
  clearInventoryFocusPath: () => void;
  getInventoryGrid: () => GridCell | null;
  getWorldGrid: () => GridCell | null;
  getCurrentGrid: () => GridCell | null;
  getGroundGrid: () => GridCell;
}

export interface StoreWithGrids {
  grids: GridsMap;
  items: ItemsMap;
  equipment: Equipment;
  inventoryFocusPath: string[];
  worldFocusPath: string[];
  selectedItemId: string | null;
}

export type NavigationSlice = NavigationState & NavigationActions;

// UI Slice
interface UIState {
  selectedItemId: string | null;
  focusedEmptySlot: SlotType | null;
  uiScale: number;
  containerRect: ContainerRect | null;
  menu: MenuState;
}

interface UIActions {
  setSelectedItem: (itemId: string | null) => void;
  setFocusedEmptySlot: (slotType: SlotType | null) => void;
  clearFocusedEmptySlot: () => void;
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

// Input Mode Slice
type InputMode = 'keyboard' | 'pointer';

interface InputModeState {
  inputMode: InputMode;
}

interface InputModeActions {
  setInputMode: (mode: InputMode) => void;
}

export type InputModeSlice = InputModeState & InputModeActions;

// Combined Store
export type InventoryStore = UISlice &
  EquipmentSlice &
  ItemsSlice &
  NavigationSlice &
  ConditionsSlice &
  EquipmentActionsSlice &
  InputModeSlice;
