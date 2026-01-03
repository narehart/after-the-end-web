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

export function toItemType(value: string): ItemType {
  const typeMap: Record<string, ItemType> = {
    container: 'container',
    consumable: 'consumable',
    weapon: 'weapon',
    clothing: 'clothing',
    ammo: 'ammo',
    tool: 'tool',
    accessory: 'accessory',
    material: 'material',
    misc: 'misc',
    medical: 'medical',
  };
  return typeMap[value] ?? 'misc';
}

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
  flavorText?: string;
  size: ItemSize;
  weight: number;
  value: number;
  stackLimit: number;
  image: string;
  allImages: string[];
  gridSize?: ItemSize;
  durability?: number;
  quantity?: number;
}

export interface ContainerItem extends Item {
  gridSize: ItemSize;
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

export interface InventoryState {
  equipment: Equipment;
  items: ItemsMap;
  grids: GridsMap;
  inventoryFocusPath: string[];
  worldFocusPath: string[];
  selectedItemId: string | null;
  focusedEmptySlot: SlotType | null;
  groundCollapsed: boolean;
  conditions: Conditions;
  menu: MenuState;
  uiScale: number;
  containerRect: ContainerRect | null;
}

export interface InventoryActions {
  setUIScale: (scale: number, containerRect?: ContainerRect | null) => void;
  setSelectedItem: (itemId: string | null) => void;
  setFocusedEmptySlot: (slotType: SlotType | null) => void;
  clearFocusedEmptySlot: () => void;
  toggleGroundCollapsed: () => void;
  clearInventoryFocusPath: () => void;
  closeAllModals: () => void;
  openMenu: (
    position: { x: number; y: number },
    itemId: string | null,
    slotType: SlotType | null,
    source?: MenuSource
  ) => void;
  closeMenu: () => void;
  navigateToContainer: (containerId: string, panel: string, fromEquipment?: boolean) => void;
  navigateBack: (index: number, panel: string) => void;
  focusOnEquipmentSlot: (slotType: SlotType) => void;
  getInventoryGrid: () => GridCell | null;
  getWorldGrid: () => GridCell | null;
  getCurrentGrid: () => GridCell | null;
  getGroundGrid: () => GridCell;
  rotateItem: (itemId: string) => void;
  getItemAtPosition: (gridId: string, x: number, y: number) => Item | null;
  findItemOrigin: (gridId: string, itemId: string) => { x: number; y: number } | null;
  findFreePosition: (
    gridId: string,
    itemWidth: number,
    itemHeight: number
  ) => { x: number; y: number } | null;
  unequipItem: (itemId: string, targetGridId: string) => boolean;
  equipItem: (itemId: string, targetSlot?: SlotType | null) => boolean;
}

export type InventoryStore = InventoryState & InventoryActions;

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
