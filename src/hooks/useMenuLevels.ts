import { useMemo } from 'react';
import { ITEM_ACTION_MENU } from '../constants/menu';
import type { UseMenuContextReturn, MenuPathSegment, MenuLevel } from '../types/inventory';
import { filterVisibleItems } from '../utils/filterVisibleItems';
import { getSegmentId } from '../utils/getSegmentId';
import { resolveItemsAtPath } from '../utils/resolveItemsAtPath';

export default function useMenuLevels(
  path: MenuPathSegment[],
  context: UseMenuContextReturn
): MenuLevel[] {
  return useMemo((): MenuLevel[] => {
    const levels: MenuLevel[] = [];

    // Level 0: root items
    const rootItems = filterVisibleItems({ items: ITEM_ACTION_MENU, context });
    const firstSegment = path[0];
    const selectedAtRoot =
      path.length > 0 && firstSegment !== undefined ? getSegmentId(firstSegment) : null;
    const selectedIndexAtRoot = rootItems.findIndex((item) => item.id === selectedAtRoot);
    levels.push({
      items: rootItems,
      selectedId: selectedAtRoot,
      selectedIndex: selectedIndexAtRoot,
    });

    // Subsequent levels based on path
    for (let depth = 0; depth < path.length; depth++) {
      const pathToHere = path.slice(0, depth + 1);
      const levelItems = resolveItemsAtPath({
        config: ITEM_ACTION_MENU,
        path: pathToHere,
        context,
      });
      const filtered = filterVisibleItems({ items: levelItems, context });
      const nextSegment = path[depth + 1];
      const selectedId =
        depth + 1 < path.length && nextSegment !== undefined ? getSegmentId(nextSegment) : null;
      const selectedIndex = filtered.findIndex((item) => item.id === selectedId);
      levels.push({ items: filtered, selectedId, selectedIndex });
    }

    return levels;
  }, [path, context]);
}
