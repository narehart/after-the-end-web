import { FIRST_INDEX, SECOND_INDEX } from '../constants/numbers';
import type { BuildStatsLineProps } from '../types/utils';

export function buildStatsLine(props: BuildStatsLineProps): string {
  const { item } = props;
  return [
    item.type.toUpperCase(),
    item.stats.weight !== FIRST_INDEX ? `${String(item.stats.weight)}kg` : null,
    item.stats.durability !== undefined ? `${String(item.stats.durability)}%` : null,
    item.stackable && item.quantity > SECOND_INDEX ? `×${String(item.quantity)}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}
