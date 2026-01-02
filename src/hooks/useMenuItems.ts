import { useMemo } from 'react';
import { ITEM_ACTION_MENU } from '../constants/menu';
import type { MenuItem, MenuContext, MenuPathSegment } from '../types/inventory';
import { filterVisibleItems } from '../utils/filterVisibleItems';
import { resolveItemsAtPath } from '../utils/resolveItemsAtPath';

export default function useMenuItems(path: MenuPathSegment[], context: MenuContext): MenuItem[] {
  return useMemo((): MenuItem[] => {
    const resolved = resolveItemsAtPath(ITEM_ACTION_MENU, path, context);
    return filterVisibleItems(resolved, context);
  }, [path, context]);
}
