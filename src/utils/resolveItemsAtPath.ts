import { FIRST_INDEX, SECOND_INDEX } from '../constants/numbers';
import type { ResolveItemsAtPathProps, MenuItem } from '../types/inventory';
import { getSegmentId } from './getSegmentId';

export function resolveItemsAtPath(props: ResolveItemsAtPathProps): MenuItem[] {
  const { config, path, context } = props;
  let currentItems = config;

  for (let i = FIRST_INDEX; i < path.length; i++) {
    const pathSegment = path[i];
    if (pathSegment === undefined) break;
    const segmentId = getSegmentId(pathSegment);
    const parentItem = currentItems.find((item) => item.id === segmentId);
    if (parentItem === undefined) break;

    const remainingPath = path.slice(i + SECOND_INDEX);

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
