import { FIRST_INDEX } from '../constants/numbers';
import type { BuildStatsLineProps } from '../types/utils';

export function buildStatsLine(props: BuildStatsLineProps): string {
  const { item } = props;
  const parts = [
    item.type.toUpperCase(),
    item.weight !== FIRST_INDEX ? `${String(item.weight)}kg` : null,
    item.durability !== undefined ? `${String(item.durability)}%` : null,
  ];
  return parts.filter(Boolean).join(' · ');
}
