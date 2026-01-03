import type { RefObject, MutableRefObject, CSSProperties } from 'react';
import type { BreadcrumbLink, GridPosition, Item } from './inventory';
import type { NavigationDirection } from './gamepad';

export type CSSPropertiesWithVars = CSSProperties & {
  [key: `--${string}`]: string | number;
};

export interface Position {
  x: number;
  y: number;
}

export interface Resolution {
  width: number;
  height: number;
}

export interface FocusedCell {
  x: number;
  y: number;
}

export interface CellState {
  isSelected: boolean;
  hasOpenModal: boolean;
  hasGrid: boolean;
}

export interface ItemGridHandlers {
  handleClick: () => void;
  openModal: (element: HTMLElement) => void;
  handleMouseEnter: () => void;
  handleFocus: () => void;
}

export interface ListItemState {
  isFocused?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isEmpty?: boolean;
}

export type BorderPosition = 'right' | 'left' | 'top' | 'bottom';

export interface LinkWithIcon extends BreadcrumbLink {
  icon?: string;
}

export interface ResolutionPreset {
  width: number | null;
  height: number | null;
  label: string;
  physicalMode?: boolean;
}

export interface ContainerInfo {
  id: string;
  name: string;
  isContainer: boolean;
  capacity: string;
}

export type KeyHandler = () => void;

export type PanelName = 'equipment' | 'inventory' | 'world';

export interface SlotState {
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
  isFocused: boolean;
  isHovered: boolean;
  hasOpenModal: boolean;
}

export interface PanelRefs {
  equipment: RefObject<HTMLDivElement | null>;
  inventory: RefObject<HTMLDivElement | null>;
  world: RefObject<HTMLDivElement | null>;
}

export interface BreadcrumbSegment {
  key: string;
  label: string;
  onClick?: (() => void) | undefined;
  isCurrent?: boolean;
  showSeparator?: boolean;
}

export interface ItemPlacement {
  id: string;
  x: number;
  y: number;
  quantity?: number;
}

export interface ItemLocation {
  gridId: string;
  positions: GridPosition[];
}

export interface GamepadRefs {
  lastButtonStates: MutableRefObject<Record<number, boolean>>;
  lastAxisStates: MutableRefObject<Position>;
}

export interface GamepadCallbacks {
  onNavigate?: ((dir: NavigationDirection) => void) | undefined;
  onConfirm?: (() => void) | undefined;
  onBack?: (() => void) | undefined;
  onNextPanel?: (() => void) | undefined;
  onPrevPanel?: (() => void) | undefined;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}

export interface GridOccupancyCell {
  occupied: boolean;
}

export type GridOccupancy = GridOccupancyCell[][];

export type TextElement = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexGap = '0' | '2' | '4' | '6' | '8' | '12' | '16' | '24' | '32';

export type IconSize = 'sm' | 'md' | 'lg' | 'fill' | number;

export type PanelHeaderTypeReturn = 'custom' | 'breadcrumb' | 'title' | 'none';
