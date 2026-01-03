import type { BuildStatsLineProps } from '../types/utils';

export function buildStatsLine(props: BuildStatsLineProps): string {
  const { item } = props;
  return [
    item.type.toUpperCase(),
    item.stats.weight !== 0 ? `${String(item.stats.weight)}kg` : null,
    item.stats.durability !== undefined ? `${String(item.stats.durability)}%` : null,
    item.stackable && item.quantity > 1 ? `×${String(item.quantity)}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}
