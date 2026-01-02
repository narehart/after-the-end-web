import { useMemo } from 'react';
import { ITEM_ACTION_MENU } from '../config/menuConfig';

function getSegmentId(segment) {
  return segment.id || segment;
}

function resolveItemsAtPath(config, path, context) {
  let currentItems = config;

  for (let i = 0; i < path.length; i++) {
    const segmentId = getSegmentId(path[i]);
    const parentItem = currentItems.find((item) => item.id === segmentId);
    if (!parentItem) break;

    const remainingPath = path.slice(i + 1).map(getSegmentId);

    if (parentItem.getItems) {
      currentItems = parentItem.getItems(context, remainingPath);
    } else if (parentItem.items) {
      currentItems = parentItem.items;
    } else {
      currentItems = [];
    }
  }

  return currentItems;
}

function filterVisibleItems(items, context) {
  return items.filter((item) => {
    if (typeof item.show === 'function') {
      return item.show(context);
    }
    return item.show !== false;
  });
}

// Returns items at the deepest path level only
export default function useMenuItems(path, context) {
  return useMemo(() => {
    const resolved = resolveItemsAtPath(ITEM_ACTION_MENU, path, context);
    return filterVisibleItems(resolved, context);
  }, [path, context]);
}

// Returns items for each level of the path (for cascading menus)
export function useMenuLevels(path, context) {
  return useMemo(() => {
    const levels = [];

    // Level 0: root items
    const rootItems = filterVisibleItems(ITEM_ACTION_MENU, context);
    const selectedAtRoot = path.length > 0 ? getSegmentId(path[0]) : null;
    const selectedIndexAtRoot = rootItems.findIndex((item) => item.id === selectedAtRoot);
    levels.push({ items: rootItems, selectedId: selectedAtRoot, selectedIndex: selectedIndexAtRoot });

    // Subsequent levels based on path
    for (let depth = 0; depth < path.length; depth++) {
      const pathToHere = path.slice(0, depth + 1);
      const levelItems = resolveItemsAtPath(ITEM_ACTION_MENU, pathToHere, context);
      const filtered = filterVisibleItems(levelItems, context);
      const selectedId = depth + 1 < path.length ? getSegmentId(path[depth + 1]) : null;
      const selectedIndex = filtered.findIndex((item) => item.id === selectedId);
      levels.push({ items: filtered, selectedId, selectedIndex });
    }

    return levels;
  }, [path, context]);
}
