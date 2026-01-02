import type { Item } from '../types/inventory';

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
