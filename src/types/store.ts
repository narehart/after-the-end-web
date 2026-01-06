import type { Conditions } from './conditions';
import type {
  ContainerRect,
  Equipment,
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
  inventoryFocusPath: string[];
  selectedItemId: string | null;
}

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
  NavigationSlice &
  ConditionsSlice &
  EquipmentActionsSlice &
  InputModeSlice;
