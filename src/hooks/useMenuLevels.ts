import { useMemo } from 'react';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/primitives';
import { ITEM_ACTION_MENU } from '../constants/inventory';
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
    const firstSegment = path[FIRST_INDEX];
    const selectedAtRoot =
      path.length > FIRST_INDEX && firstSegment !== undefined ? getSegmentId(firstSegment) : null;
    const selectedIndexAtRoot = rootItems.findIndex((item) => item.id === selectedAtRoot);
    levels.push({
      items: rootItems,
      selectedId: selectedAtRoot,
      selectedIndex: selectedIndexAtRoot,
    });

    // Subsequent levels based on path
    for (let depth = FIRST_INDEX; depth < path.length; depth++) {
      const pathToHere = path.slice(FIRST_INDEX, depth + SECOND_INDEX);
      const levelItems = resolveItemsAtPath({
        config: ITEM_ACTION_MENU,
        path: pathToHere,
        context,
      });
      const filtered = filterVisibleItems({ items: levelItems, context });
      const nextSegment = path[depth + SECOND_INDEX];
      const selectedId =
        depth + SECOND_INDEX < path.length && nextSegment !== undefined
          ? getSegmentId(nextSegment)
          : null;
      const selectedIndex = filtered.findIndex((item) => item.id === selectedId);
      levels.push({ items: filtered, selectedId, selectedIndex });
    }

    return levels;
  }, [path, context]);
}
