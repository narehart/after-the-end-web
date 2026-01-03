import type { GetItemIconProps } from '../types/utils';
import { ITEM_ICONS } from '../constants/items';

export function getItemIcon(props: GetItemIconProps): string {
  const { type } = props;
  return ITEM_ICONS[type];
}
