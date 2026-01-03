import { FIRST_INDEX } from '../constants/numbers';
import type { BuildStatsLineProps } from '../types/utils';

export function buildStatsLine(props: BuildStatsLineProps): string {
  const { item } = props;
  return [item.type.toUpperCase(), item.weight !== FIRST_INDEX ? `${String(item.weight)}kg` : null]
    .filter(Boolean)
    .join(' · ');
}
