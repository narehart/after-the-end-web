import type { ItemType } from '../types/inventory';

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
