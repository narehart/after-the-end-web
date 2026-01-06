import { MAX_CONTAINER_ITEMS, MIN_CONTAINER_ITEMS } from '../constants/inventory';
import { FIRST_INDEX } from '../constants/primitives';
import type { ItemPlacement } from '../types/inventory';
import { createOccupancyGrid } from './createOccupancyGrid';
import { fillContainerWithItems } from './fillContainerWithItems';
import { placeGuaranteedStackable } from './placeGuaranteedStackable';
import { randomInt } from './randomInt';

interface GetRandomContainerContentsProps {
  width: number;
  height: number;
  minItems?: number;
  maxItems?: number;
}

export function getRandomContainerContents(
  props: GetRandomContainerContentsProps
): ItemPlacement[] {
  const { width, height, minItems = MIN_CONTAINER_ITEMS, maxItems = MAX_CONTAINER_ITEMS } = props;

  const placements: ItemPlacement[] = [];
  const grid = createOccupancyGrid({ width, height });
  const targetCount = randomInt({ min: minItems, max: maxItems });

  // Guarantee at least one stackable item with quantity > 1
  const guaranteed = placeGuaranteedStackable({ grid, gridWidth: width, gridHeight: height });
  if (guaranteed !== null) {
    placements.push(guaranteed);
  }

  // Fill remaining slots
  const remainingCount = targetCount - placements.length;
  if (remainingCount > FIRST_INDEX) {
    const fillProps =
      guaranteed !== null
        ? {
            grid,
            gridWidth: width,
            gridHeight: height,
            targetCount: remainingCount,
            excludeId: guaranteed.id,
          }
        : { grid, gridWidth: width, gridHeight: height, targetCount: remainingCount };
    const additional = fillContainerWithItems(fillProps);
    placements.push(...additional);
  }

  return placements;
}
