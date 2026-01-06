import { EQUIPMENT_LABELS } from '../constants/equipment';
import type { MenuItem, UseMenuContextReturn } from '../types/inventory';
import { buildDestinationItems } from './buildDestinationItems';
import { getContainerInfo } from './getContainerInfo';
import { isEquipmentSlot } from './isEquipmentSlot';

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

  // For split action, current container is a valid destination
  const allowCurrentContainer = action === 'split';

  const isOnGround = currentContainerId === 'ground';
  const groundBlocked = isOnGround && !allowCurrentContainer;
  items.push({
    id: 'ground',
    label: groundBlocked ? 'Ground (already here)' : 'Ground',
    type: 'navigate',
    hasChildren: !groundBlocked,
    disabled: (): boolean => groundBlocked || !canFitItem('ground'),
    data: { containerId: 'ground', action },
    getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
      buildDestinationItems(ctx2, ['ground'], action),
  });

  Object.entries(equipment).forEach(([slot, equippedId]) => {
    if (equippedId === null || equippedId === itemId) return;
    const info = getContainerInfo(ctx, equippedId);
    if (info !== null) {
      const isCurrentContainer = equippedId === currentContainerId;
      const containerBlocked = isCurrentContainer && !allowCurrentContainer;
      const slotLabel = isEquipmentSlot(slot) ? EQUIPMENT_LABELS[slot] : info.name;
      items.push({
        id: info.id,
        label: containerBlocked ? `${slotLabel} (already here)` : slotLabel,
        type: 'navigate',
        hasChildren: !containerBlocked,
        disabled: (): boolean => containerBlocked || !canFitItem(equippedId),
        meta: info.capacity,
        data: { containerId: info.id, action },
        getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
          buildDestinationItems(ctx2, [info.id], action),
      });
    }
  });

  return items;
}
