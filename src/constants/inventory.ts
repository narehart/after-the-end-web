import type { MoveItemReturn, SplitItemReturn } from '../types/inventory';

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
