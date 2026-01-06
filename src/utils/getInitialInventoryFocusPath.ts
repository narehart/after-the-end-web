import type { Equipment, ItemsMap } from '../types/inventory';
import { FIRST_INDEX } from '../constants/array';

;

interface GetInitialInventoryFocusPathProps {
  equipment: Equipment;
  items: ItemsMap;
}

export function getInitialInventoryFocusPath({
  equipment,
  items,
}: GetInitialInventoryFocusPathProps): string[] {
  const equippedIds = Object.values(equipment).filter((id): id is string => id !== null);

  let largestId: string | null = null;
  let largestSize = FIRST_INDEX;

  for (const id of equippedIds) {
    const item = items[id];
    if (item?.gridSize !== undefined) {
      const size = item.gridSize.width * item.gridSize.height;
      if (size > largestSize) {
        largestSize = size;
        largestId = id;
      }
    }
  }

  return largestId !== null ? [largestId] : [];
}
