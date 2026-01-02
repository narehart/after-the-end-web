import { useMemo } from 'react';
import { ITEM_ACTION_MENU } from '../constants/menu';
import type { MenuItem, MenuContext, MenuPathSegment, MenuLevel } from '../types/inventory';

function getSegmentId(segment: MenuPathSegment | string): string {
  if (typeof segment === 'string') return segment;
  return segment.id;
}

function resolveItemsAtPath(
  config: MenuItem[],
  path: MenuPathSegment[],
  context: MenuContext
): MenuItem[] {
  let currentItems = config;

  for (let i = 0; i < path.length; i++) {
    const pathSegment = path[i];
    if (pathSegment === undefined) break;
    const segmentId = getSegmentId(pathSegment);
    const parentItem = currentItems.find((item) => item.id === segmentId);
    if (parentItem === undefined) break;

    const remainingPath = path.slice(i + 1);

    if (parentItem.getItems !== undefined) {
      currentItems = parentItem.getItems(context, remainingPath);
    } else if (parentItem.items !== undefined) {
      currentItems = parentItem.items;
    } else {
      currentItems = [];
    }
  }

  return currentItems;
}

function filterVisibleItems(items: MenuItem[], context: MenuContext): MenuItem[] {
  return items.filter((item) => {
    if (typeof item.show === 'function') {
      return item.show(context);
    }
    return item.show !== false;
  });
}

// Returns items at the deepest path level only
export default function useMenuItems(path: MenuPathSegment[], context: MenuContext): MenuItem[] {
  return useMemo((): MenuItem[] => {
    const resolved = resolveItemsAtPath(ITEM_ACTION_MENU, path, context);
    return filterVisibleItems(resolved, context);
  }, [path, context]);
}

// Returns items for each level of the path (for cascading menus)
export function useMenuLevels(path: MenuPathSegment[], context: MenuContext): MenuLevel[] {
  return useMemo((): MenuLevel[] => {
    const levels: MenuLevel[] = [];

    // Level 0: root items
    const rootItems = filterVisibleItems(ITEM_ACTION_MENU, context);
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
      const levelItems = resolveItemsAtPath(ITEM_ACTION_MENU, pathToHere, context);
      const filtered = filterVisibleItems(levelItems, context);
      const nextSegment = path[depth + 1];
      const selectedId =
        depth + 1 < path.length && nextSegment !== undefined ? getSegmentId(nextSegment) : null;
      const selectedIndex = filtered.findIndex((item) => item.id === selectedId);
      levels.push({ items: filtered, selectedId, selectedIndex });
    }

    return levels;
  }, [path, context]);
}
