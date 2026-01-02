import type { Item, ItemType } from '../types/inventory';

export const ITEM_ICONS: Record<ItemType, string> = {
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

export function buildStatsLine(item: Item): string {
  return [
    item.type.toUpperCase(),
    item.stats.weight !== 0 ? `${String(item.stats.weight)}kg` : null,
    item.stats.durability !== undefined ? `${String(item.stats.durability)}%` : null,
    item.stackable && item.quantity > 1 ? `×${String(item.quantity)}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export interface ItemDimensions {
  itemWidth: number;
  itemHeight: number;
}

const CELL_GAP = 2;

export function calculateItemDimensions(item: Item, cellSize: number): ItemDimensions {
  const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
  return { itemWidth, itemHeight };
}
