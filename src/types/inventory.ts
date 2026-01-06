import type { RefObject } from 'react';
import type { EntityId } from '../ecs/world';
import type { Equipment, EquipmentSlot } from './equipment';

export interface MoveItemReturn {
  success: boolean;
  merged: boolean;
}

export interface SplitItemReturn {
  success: boolean;
  newEntityId: EntityId | null;
}

export type PanelName = 'equipment' | 'inventory' | 'world';

export interface PanelRefs {
  equipment: RefObject<HTMLDivElement | null>;
  inventory: RefObject<HTMLDivElement | null>;
  world: RefObject<HTMLDivElement | null>;
}

export type ItemType =
  | 'container'
  | 'consumable'
  | 'weapon'
  | 'clothing'
  | 'ammo'
  | 'tool'
  | 'accessory'
  | 'material'
  | 'misc'
  | 'medical';

export interface ItemSize {
  width: number;
  height: number;
}

export interface Item {
  id: string;
  neoId: string;
  type: ItemType;
  name: string;
  description: string;
  size: ItemSize;
  weight: number;
  value: number;
  stackLimit: number;
  image: string;
  allImages: string[];
  gridSize?: ItemSize;
  durability?: number;
  quantity?: number;
  usable?: boolean;
}

export type ItemsMap = Record<string, Item | undefined>;

export type CellGrid = Array<Array<string | null>>;

export interface GridPosition {
  x: number;
  y: number;
}

export interface GridCell {
  cells: CellGrid;
  width: number;
  height: number;
}

export type GridsMap = Record<string, GridCell | undefined>;

export interface MenuPathSegment {
  id: string;
  label: string;
}

export type MenuSource = 'equipment' | 'grid' | 'ground' | 'world' | null;

export interface MenuState {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  targetItemId: string | null;
  targetEquipmentSlot: EquipmentSlot | null;
  itemId: string | null;
  source: MenuSource;
  path: MenuPathSegment[];
  focusIndex: number;
}

export interface ContainerRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface BreadcrumbLink {
  label: string;
  onClick?: (() => void) | undefined;
}

export interface BreadcrumbLinkWithIcon extends BreadcrumbLink {
  icon?: string;
}

export type PanelType = 'inventory' | 'world';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  type: 'action' | 'navigate' | 'select';
  hasChildren?: boolean;
  disabled?: (ctx: UseMenuContextReturn) => boolean;
  show?: boolean | ((ctx: UseMenuContextReturn) => boolean);
  meta?: string;
  data?: {
    containerId?: string;
    action?: string;
  };
  getItems?: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]) => MenuItem[];
  items?: MenuItem[];
}

export interface UseMenuContextReturn {
  item: Item | undefined;
  itemId: string | null;
  source: MenuSource;
  panel: PanelType;
  equipment: Equipment;
  allItems: ItemsMap;
  grids: GridsMap;
  currentContainerId: string | null;
  canFitItem: (containerId: string) => boolean;
  navigateToContainer: (containerId: string, panel: string, fromEquipment?: boolean) => void;
  equipItem: (itemId: string, targetSlot?: EquipmentSlot | null) => boolean;
  unequipItem: (itemId: string, targetGridId: string) => boolean;
  moveItem: (itemId: string, targetGridId: string) => boolean;
  splitItem: (itemId: string, targetGridId: string) => boolean;
  destroyItem: (itemId: string) => boolean;
  emptyContainer: (containerId: string) => boolean;
  closeMenu: () => void;
}

export interface MenuLevel {
  items: MenuItem[];
  selectedId: string | null;
  selectedIndex: number;
}

// Grid occupancy types (for random placement algorithms)
export interface GridOccupancyCell {
  occupied: boolean;
}

export type GridOccupancy = GridOccupancyCell[][];

export interface ItemPlacement {
  id: string;
  x: number;
  y: number;
  quantity?: number;
}

// Container info types
export interface ContainerInfo {
  id: string;
  name: string;
  isContainer: boolean;
  capacity: string;
}
