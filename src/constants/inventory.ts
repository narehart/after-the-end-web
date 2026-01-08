import type {
  ItemPlacement,
  MenuItem,
  MenuPathSegment,
  MoveItemReturn,
  PanelName,
  SplitItemReturn,
  UseMenuContextReturn,
  ItemType,
} from '../types/inventory';
import { buildDestinationItems } from '../utils/buildDestinationItems';
import { findFirstAvailableContainer } from '../utils/findFirstAvailableContainer';
import { isGridEmpty } from '../utils/isGridEmpty';

export const MOVE_ITEM_FAIL: MoveItemReturn = { success: false, merged: false };
export const SPLIT_ITEM_FAIL: SplitItemReturn = { success: false, newEntityId: null };

// Item constants
export const ITEM_ICONS: Record<ItemType, string> = {
  container: '📦',
  consumable: '💊',
  weapon: '🗡',
  clothing: '👔',
  ammo: '🔸',
  tool: '🔦',
  accessory: '🔹',
  material: '🪵',
  misc: '📎',
  medical: '💉',
};

export const MAX_DURABILITY = 100;
export const MIN_DURABILITY = 1;
export const DEFAULT_QUANTITY = 1;
export const EMPTY_COUNT = 0;

// Stackable items suitable for containers with their max quantities
export const STACKABLE_ITEM_CONFIGS = [
  { id: 'neo_43', maxQty: 4 }, // crackers
  { id: 'neo_46', maxQty: 10 }, // pink pill
  { id: 'neo_47', maxQty: 10 }, // white pill
  { id: 'neo_49', maxQty: 5 }, // gelli bears
  { id: 'neo_51', maxQty: 10 }, // ketchup packet
  { id: 'neo_68', maxQty: 5 }, // bullets
  { id: 'neo_69', maxQty: 5 }, // bullets
  { id: 'neo_101', maxQty: 20 }, // electric charge
  { id: 'neo_115', maxQty: 5 }, // berries black
  { id: 'neo_117', maxQty: 5 }, // berries red
  { id: 'neo_289', maxQty: 6 }, // bullets
  { id: 'neo_290', maxQty: 6 }, // bullets
];

// Single items (non-stackable or low stack limit)
export const SINGLE_ITEM_IDS = [
  'neo_4', // soup can
  'neo_27', // medical kit
  'neo_35', // water bottle
  'neo_146', // paper scrap
];

// Random container content defaults
export const MIN_CONTAINER_ITEMS = 2;
export const MAX_CONTAINER_ITEMS = 5;
export const MIN_GUARANTEED_QUANTITY = 2;

// Random number generation
export const SHUFFLE_MIDPOINT = 0.5;

// Ground grid dimensions
export const GROUND_WIDTH = 10;
export const GROUND_HEIGHT = 40;

// Pre-defined ground item configurations - each is a valid non-overlapping layout
export const GROUND_LAYOUTS: ItemPlacement[][] = [
  [
    { id: 'neo_1', x: 0, y: 0 }, // bag
    { id: 'neo_318', x: 5, y: 0 }, // flashlight
    { id: 'neo_136', x: 8, y: 0 }, // bottle
    { id: 'neo_3', x: 0, y: 6 }, // branch
  ],
  [
    { id: 'neo_327', x: 0, y: 0 }, // laptop
    { id: 'neo_4', x: 6, y: 0 }, // tin can
    { id: 'neo_104', x: 0, y: 3 }, // metal pot
    { id: 'neo_318', x: 5, y: 3 }, // flashlight
  ],
  [
    { id: 'neo_136', x: 0, y: 0 }, // bottle
    { id: 'neo_3', x: 2, y: 0 }, // branch
    { id: 'neo_1', x: 4, y: 0 }, // bag
    { id: 'neo_327', x: 0, y: 6 }, // laptop
    { id: 'neo_4', x: 6, y: 6 }, // tin can
  ],
  [
    { id: 'neo_104', x: 0, y: 0 }, // metal pot
    { id: 'neo_318', x: 5, y: 0 }, // flashlight
    { id: 'neo_136', x: 8, y: 0 }, // bottle
    { id: 'neo_1', x: 0, y: 2 }, // bag
    { id: 'neo_3', x: 5, y: 2 }, // branch
  ],
  [
    { id: 'neo_4', x: 0, y: 0 }, // tin can
    { id: 'neo_327', x: 3, y: 0 }, // laptop
    { id: 'neo_136', x: 8, y: 0 }, // bottle
    { id: 'neo_318', x: 0, y: 3 }, // flashlight
  ],
];

// Item action menu configuration
export const ITEM_ACTION_MENU: MenuItem[] = [
  {
    id: 'open',
    label: 'Open',
    icon: '▶',
    type: 'action',
    show: (): boolean => false, // Hidden: use double-click to open containers
  },
  {
    id: 'use',
    label: 'Use',
    icon: '○',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.item?.usable === true,
  },
  {
    id: 'equip',
    label: 'Equip',
    icon: '◆',
    type: 'action',
    // TODO: Re-enable when equippable slots data is added to neoItems.json
    show: (): boolean => false,
  },
  {
    id: 'unequip',
    label: 'Unequip to...',
    icon: '◇',
    type: 'navigate',
    hasChildren: true,
    show: (): boolean => false, // Hidden: use Drop to unequip
    getItems: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'unequip'),
  },
  {
    id: 'rotate',
    label: 'Rotate',
    icon: '↻',
    type: 'action',
    show: (): boolean => false, // Hidden: use drag rotation instead
  },
  {
    id: 'split',
    label: 'Split to...',
    icon: '÷',
    type: 'navigate',
    hasChildren: true,
    show: (): boolean => false, // Hidden: use drag split instead
    getItems: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'split'),
  },
  {
    id: 'move',
    label: 'Move to...',
    icon: '→',
    type: 'navigate',
    hasChildren: true,
    show: (): boolean => false, // Hidden: use drag-and-drop instead
    getItems: (ctx: UseMenuContextReturn, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'move'),
  },
  {
    id: 'drop',
    label: 'Drop',
    icon: '↓',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.source !== 'ground',
    disabled: (ctx: UseMenuContextReturn): boolean => !ctx.canFitItem('ground'),
  },
  {
    id: 'take',
    label: 'Take',
    icon: '↑',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.panel === 'world',
    disabled: (ctx: UseMenuContextReturn): boolean => findFirstAvailableContainer(ctx) === null,
  },
  {
    id: 'empty',
    label: 'Empty out',
    icon: '⤓',
    type: 'action',
    show: (ctx: UseMenuContextReturn): boolean => ctx.item?.gridSize !== undefined,
    disabled: (ctx: UseMenuContextReturn): boolean => {
      if (ctx.itemId === null) return true;
      const grid = ctx.grids[ctx.itemId];
      if (grid === undefined) return true;
      return isGridEmpty({ grid });
    },
  },
  {
    id: 'destroy',
    label: 'Destroy',
    icon: '✕',
    type: 'action',
    show: (): boolean => true,
  },
];

// Panel navigation
export const PANELS: readonly PanelName[] = ['equipment', 'inventory', 'world'];
