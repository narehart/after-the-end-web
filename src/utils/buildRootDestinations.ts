import type { MenuItem, UseMenuContextReturn } from '../types/inventory';
import { getContainerInfo } from './getContainerInfo';
import { buildDestinationItems } from './buildDestinationItems';

interface BuildRootDestinationsProps {
  ctx: UseMenuContextReturn;
  action: string;
}

type BuildRootDestinationsReturn = MenuItem[];

export function buildRootDestinations(
  props: BuildRootDestinationsProps
): BuildRootDestinationsReturn {
  const { ctx, action } = props;
  const { equipment, itemId, canFitItem, currentContainerId } = ctx;
  const items: MenuItem[] = [];

  const isOnGround = currentContainerId === 'ground';
  items.push({
    id: 'ground',
    label: isOnGround ? 'Ground (already here)' : 'Ground',
    type: 'navigate',
    hasChildren: !isOnGround,
    disabled: (): boolean => isOnGround || !canFitItem('ground'),
    data: { containerId: 'ground', action },
    getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
      buildDestinationItems(ctx2, ['ground'], action),
  });

  Object.values(equipment).forEach((equippedId) => {
    if (equippedId === null || equippedId === itemId) return;
    const info = getContainerInfo(ctx, equippedId);
    if (info !== null) {
      const isCurrentContainer = equippedId === currentContainerId;
      items.push({
        id: info.id,
        label: isCurrentContainer ? `${info.name} (already here)` : info.name,
        type: 'navigate',
        hasChildren: !isCurrentContainer,
        disabled: (): boolean => isCurrentContainer || !canFitItem(equippedId),
        meta: info.capacity,
        data: { containerId: info.id, action },
        getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
          buildDestinationItems(ctx2, [info.id], action),
      });
    }
  });

  return items;
}
