import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ForwardRefExoticComponent,
} from 'react';
import type { Conditions } from './conditions';
import type { Equipment, EquipmentSlot } from './equipment';
import type { ContainerRect, Item, MenuPathSegment, MenuSource, MenuState } from './inventory';
import type { SettingsSlice } from './settings';

// Flex component types
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexGap = '0' | '2' | '4' | '6' | '8' | '12' | '16' | '24' | '32';

// Text component types
export type TextElement = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
export type TextType = 'secondary' | 'muted';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg';
export type TextAlign = 'left' | 'center' | 'right';
export type TextSpacing = 'tight' | 'normal' | 'wide';

// Icon component types
export type IconSize = 'sm' | 'md' | 'lg' | 'fill' | number;

// Button component types
export type ButtonVariant = 'default' | 'text' | 'toolbar' | 'ghost';

// Panel component types
export type BorderPosition = 'right' | 'left' | 'top' | 'bottom';

// CSS types
export type CSSPropertiesWithVars = CSSProperties & {
  [key: `--${string}`]: string | number;
};

// Resolution types
export interface Resolution {
  width: number;
  height: number;
}

// Grid navigation types
export interface FocusedCell {
  x: number;
  y: number;
}

// Item grid cell types
export interface CellState {
  isSelected: boolean;
  hasOpenModal: boolean;
  hasGrid: boolean;
}

export interface ItemGridHandlers {
  handleClick: () => void;
  openModal: (element: HTMLElement) => void;
  openContainer: () => void;
  handleMouseEnter: () => void;
  handleFocus: () => void;
}

// Equipment slot types
export interface SlotState {
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
  isFocused: boolean;
  isHovered: boolean;
  hasOpenModal: boolean;
}

// Breadcrumb types
export interface BreadcrumbSegment {
  key: string;
  label: string;
  onClick?: (() => void) | undefined;
  isCurrent?: boolean;
  showSeparator?: boolean;
}

// Callback types
export type KeyHandler = () => void;

// Polymorphic component types
/**
 * Distributive Omit - preserves union types during omit operation
 */
type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;

/**
 * Merge two types, with TOverride's properties taking precedence
 */
type Merge<TBase, TOverride> = Omit<TBase, keyof TOverride> & TOverride;

/**
 * Distributive merge - preserves union types during merge
 */
type DistributiveMerge<TBase, TOverride> = DistributiveOmit<TBase, keyof TOverride> & TOverride;

/**
 * Props for a polymorphic component with `as` prop
 */
export type PolymorphicProps<
  TComponent extends ElementType,
  TOwnProps extends object,
> = DistributiveMerge<ComponentPropsWithRef<TComponent>, TOwnProps & { as?: TComponent }>;

/**
 * Polymorphic component type with forwardRef support
 */
export type PolymorphicComponent<
  TDefault extends ElementType,
  TOwnProps extends object = object,
> = ForwardRefExoticComponent<
  Merge<ComponentPropsWithRef<TDefault>, TOwnProps & { as?: TDefault }>
> &
  (<TComponent extends ElementType = TDefault>(
    props: PolymorphicProps<TComponent, TOwnProps>
  ) => React.ReactElement | null);

// Store slice types
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
  setEquipmentSlot: (slot: EquipmentSlot, itemId: string | null) => void;
}

export type EquipmentSlice = EquipmentState & EquipmentActions;

// Equipment Actions Slice
export interface EquipmentActionsSlice {
  unequipItem: (itemId: string, targetGridId: string) => boolean;
  equipItem: (itemId: string, targetSlot?: EquipmentSlot | null) => boolean;
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
  focusOnEquipmentSlot: (slotType: EquipmentSlot) => void;
  clearInventoryFocusPath: () => void;
}

export type NavigationSlice = NavigationState & NavigationActions;

// UI Slice
interface UIState {
  selectedItemId: string | null;
  focusedEmptySlot: EquipmentSlot | null;
  uiScale: number;
  containerRect: ContainerRect | null;
  menu: MenuState;
}

interface UIActions {
  setSelectedItem: (itemId: string | null) => void;
  setFocusedEmptySlot: (slotType: EquipmentSlot | null) => void;
  clearFocusedEmptySlot: () => void;
  setUIScale: (scale: number, containerRect?: ContainerRect | null) => void;
  openMenu: (
    position: { x: number; y: number },
    itemId: string | null,
    slotType: EquipmentSlot | null,
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

// Screen navigation types
export type ScreenId = 'inventory' | 'character' | 'status' | 'camping' | 'settings';

export interface ScreenTab {
  id: ScreenId;
  label: string;
  icon: string;
}

// Main Menu Slice
interface MainMenuState {
  activeScreen: ScreenId;
  isMainMenuOpen: boolean;
}

interface MainMenuActions {
  setActiveScreen: (screen: ScreenId) => void;
  toggleMainMenu: () => void;
  openMainMenu: () => void;
  closeMainMenu: () => void;
}

export type MainMenuSlice = MainMenuState & MainMenuActions;

// Display info types
export type DisplaySource = 'tauri' | 'browser';

export interface DisplayInfo {
  width: number;
  height: number;
  scaleFactor: number;
  aspectRatio: number;
  aspectRatioLabel: string;
  name: string | null;
  source: DisplaySource;
}

// Combined Store
export type InventoryStore = UISlice &
  EquipmentSlice &
  NavigationSlice &
  ConditionsSlice &
  EquipmentActionsSlice &
  InputModeSlice &
  SettingsSlice &
  MainMenuSlice;
