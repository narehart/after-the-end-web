import { FIRST_INDEX } from '../constants/numbers';
import { INITIAL_EQUIPMENT } from '../constants/equipment';
import { getItemById } from '../data/items';

export function getInitialInventoryFocusPath(): string[] {
  const equippedIds = Object.values(INITIAL_EQUIPMENT).filter((id): id is string => id !== null);

  let largestId: string | null = null;
  let largestSize = FIRST_INDEX;

  for (const id of equippedIds) {
    const item = getItemById(id);
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
