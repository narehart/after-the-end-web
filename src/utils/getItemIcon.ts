import type { ItemType } from '../types/inventory';
import { ITEM_ICONS } from '../constants/items';

export function getItemIcon(type: ItemType): string {
  return ITEM_ICONS[type];
}
