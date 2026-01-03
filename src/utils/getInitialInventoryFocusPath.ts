import { INITIAL_EQUIPMENT } from '../constants/equipment';
import { initialGrids } from '../constants/initialGrids';

export function getInitialInventoryFocusPath(): string[] {
  const equippedIds = Object.values(INITIAL_EQUIPMENT).filter((id): id is string => id !== null);

  let largestId: string | null = null;
  let largestSize = 0;

  for (const id of equippedIds) {
    const grid = initialGrids[id];
    if (grid !== undefined) {
      const size = grid.width * grid.height;
      if (size > largestSize) {
        largestSize = size;
        largestId = id;
      }
    }
  }

  return largestId !== null ? [largestId] : [];
}
