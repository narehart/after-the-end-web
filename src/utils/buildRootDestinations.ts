import { SLOT_LABELS } from '../constants/slotLabels';
import type { MenuItem, UseMenuContextReturn } from '../types/inventory';
import { buildDestinationItems } from './buildDestinationItems';
import { getContainerInfo } from './getContainerInfo';
import { isSlotType } from './isSlotType';

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

  Object.entries(equipment).forEach(([slot, equippedId]) => {
    if (equippedId === null || equippedId === itemId) return;
    const info = getContainerInfo(ctx, equippedId);
    if (info !== null) {
      const isCurrentContainer = equippedId === currentContainerId;
      const slotLabel = isSlotType(slot) ? SLOT_LABELS[slot] : info.name;
      items.push({
        id: info.id,
        label: isCurrentContainer ? `${slotLabel} (already here)` : slotLabel,
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
