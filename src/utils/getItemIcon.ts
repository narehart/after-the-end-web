import type { ItemType } from '../types/inventory';

const ITEM_ICONS: Record<ItemType, string> = {
  container: '📦',
  consumable: '💊',
  weapon: '🗡',
  clothing: '👔',
  ammo: '🔸',
  tool: '🔦',
  accessory: '🔹',
};

export function getItemIcon(type: ItemType): string {
  return ITEM_ICONS[type];
}
