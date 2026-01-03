import { useMemo } from 'react';
import { ITEM_ACTION_MENU } from '../constants/menu';
import type { MenuItem, UseMenuContextReturn, MenuPathSegment } from '../types/inventory';
import { filterVisibleItems } from '../utils/filterVisibleItems';
import { resolveItemsAtPath } from '../utils/resolveItemsAtPath';

export default function useMenuItems(
  path: MenuPathSegment[],
  context: UseMenuContextReturn
): MenuItem[] {
  return useMemo((): MenuItem[] => {
    const resolved = resolveItemsAtPath({ config: ITEM_ACTION_MENU, path, context });
    return filterVisibleItems({ items: resolved, context });
  }, [path, context]);
}
