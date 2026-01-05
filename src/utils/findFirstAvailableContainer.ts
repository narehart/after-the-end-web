import type { UseMenuContextReturn } from '../types/inventory';

type FindFirstAvailableContainerReturn = string | null;

export function findFirstAvailableContainer(
  ctx: UseMenuContextReturn
): FindFirstAvailableContainerReturn {
  const { equipment, allItems, canFitItem, itemId } = ctx;

  for (const equippedId of Object.values(equipment)) {
    if (equippedId === null || equippedId === itemId) continue;

    const containerItem = allItems[equippedId];
    if (containerItem?.gridSize === undefined) continue;

    if (canFitItem(equippedId)) {
      return equippedId;
    }
  }

  return null;
}
