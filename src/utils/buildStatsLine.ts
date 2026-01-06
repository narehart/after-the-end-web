import { EMPTY_COUNT } from '../constants/items';
import { FIRST_INDEX } from '../constants/array';
import type { GridsMap, Item } from '../types/inventory';
import { countGridItems } from './countGridItems';

interface BuildStatsLineProps {
  item: Item;
  grids: GridsMap;
}

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
