import type { MenuItem, MenuContext, MenuPathSegment } from '../types/inventory';
import { getSegmentId } from './getSegmentId';

export function resolveItemsAtPath(
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
