import type { BreadcrumbLink, Item } from './inventory';

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

// Grid panel uses a simpler cell state (no hasOpenModal)
export interface GridPanelCellState {
  isSelected: boolean;
  hasGrid: boolean;
}

export interface SlotState {
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
  isFocused: boolean;
  isHovered: boolean;
  hasOpenModal: boolean;
}
