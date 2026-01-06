import type { ItemType } from '../types/inventory';
import { ITEM_ICONS } from '../constants/inventory';

interface GetItemIconProps {
  type: ItemType;
}

export function getItemIcon(props: GetItemIconProps): string {
  const { type } = props;
  return ITEM_ICONS[type];
}
