import { FIRST_INDEX, SECOND_INDEX } from '../constants/numbers';
import type { MenuItem, UseMenuContextReturn, MenuPathSegment } from '../types/inventory';
import { buildRootDestinations } from './buildRootDestinations';
import { buildNestedDestinations } from './buildNestedDestinations';

type BuildDestinationItemsReturn = MenuItem[];

export function buildDestinationItems(
  ctx: UseMenuContextReturn,
  path: string[] | MenuPathSegment[],
  action: string
): BuildDestinationItemsReturn {
  const items: MenuItem[] = [];
  const { allItems, canFitItem } = ctx;

  // Convert path to string array if needed
  const pathIds = path.map((p): string => (typeof p === 'string' ? p : p.id));

  if (pathIds.length > FIRST_INDEX) {
    const currentContainerId = pathIds[pathIds.length - SECOND_INDEX];
    if (currentContainerId !== undefined) {
      const canFit = canFitItem(currentContainerId);
      const isGround = currentContainerId === 'ground';
      const containerName = isGround ? 'Ground' : (allItems[currentContainerId]?.name ?? 'here');

      items.push({
        id: 'place-here',
        label: isGround ? 'Place on Ground' : `Place in ${containerName}`,
        type: 'select',
        disabled: (): boolean => !canFit,
        data: { containerId: currentContainerId, action },
      });
    }
  }

  const destinations =
    pathIds.length === FIRST_INDEX
      ? buildRootDestinations({ ctx, action })
      : buildNestedDestinations({ ctx, path: pathIds, action });

  return [...items, ...destinations];
}
