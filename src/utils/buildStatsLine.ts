import { EMPTY_COUNT, FIRST_INDEX } from '../constants/numbers';
import type { BuildStatsLineProps } from '../types/utils';
import { countGridItems } from './countGridItems';

export function buildStatsLine(props: BuildStatsLineProps): string {
  const { item, grids } = props;
  const contentsCount = countGridItems(grids[item.id]);
  const parts = [
    item.value !== FIRST_INDEX ? `$${String(item.value)}` : null,
    item.durability !== undefined ? `${String(item.durability)}%` : null,
    item.weight !== FIRST_INDEX ? `${String(item.weight)}kg` : null,
    contentsCount > EMPTY_COUNT ? `${String(contentsCount)} items` : null,
  ];
  return parts.filter(Boolean).join(' · ');
}
