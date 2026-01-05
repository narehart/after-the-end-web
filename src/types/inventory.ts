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

export type SlotType =
  | 'helmet'
  | 'eyes'
  | 'face'
  | 'neck'
  | 'backpack'
  | 'coat'
  | 'vest'
  | 'shirt'
  | 'rightShoulder'
  | 'leftShoulder'
  | 'rightGlove'
  | 'leftGlove'
  | 'rightRing'
  | 'leftRing'
  | 'rightHolding'
  | 'leftHolding'
  | 'pouch'
  | 'pants'
  | 'rightShoe'
  | 'leftShoe';

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

export type Equipment = Record<SlotType, string | null>;

export interface Conditions {
  health: number;
  hunger: number;
  thirst: number;
  temperature: number;
  encumbrance: number;
}

export interface MenuPathSegment {
  id: string;
  label: string;
}

export type MenuSource = 'equipment' | 'grid' | 'ground' | 'world' | null;

export interface MenuState {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  targetItemId: string | null;
  targetSlotType: SlotType | null;
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

export interface UseMenuContextProps {
  menu: MenuState;
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
  rotateItem: (itemId: string) => void;
  equipItem: (itemId: string, targetSlot?: SlotType | null) => boolean;
  unequipItem: (itemId: string, targetGridId: string) => boolean;
  moveItem: (itemId: string, targetGridId: string) => boolean;
  splitItem: (itemId: string, targetGridId: string) => boolean;
  closeMenu: () => void;
}

export interface MenuLevel {
  items: MenuItem[];
  selectedId: string | null;
  selectedIndex: number;
}

// Utility function Props interfaces
export interface HandleActionProps {
  item: MenuItem;
  context: UseMenuContextReturn;
}

export interface HandleSelectActionProps {
  item: MenuItem;
  context: UseMenuContextReturn;
}

export interface HandleNavigateActionProps {
  item: MenuItem;
}

export interface FilterVisibleItemsProps {
  items: MenuItem[];
  context: UseMenuContextReturn;
}

export interface ResolveItemsAtPathProps {
  config: MenuItem[];
  path: MenuPathSegment[];
  context: UseMenuContextReturn;
}

export interface UseMenuActionsProps {
  context: UseMenuContextReturn;
}
