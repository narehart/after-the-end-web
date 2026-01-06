import type { ItemPlacement, MoveItemReturn, SplitItemReturn } from '../types/inventory';

export const MOVE_ITEM_FAIL: MoveItemReturn = { success: false, merged: false };
export const SPLIT_ITEM_FAIL: SplitItemReturn = { success: false, newEntityId: null };

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
