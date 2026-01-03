import {
  MAX_CONTAINER_ITEMS,
  MIN_CONTAINER_ITEMS,
  SHUFFLE_MIDPOINT,
  SINGLE_ITEM_IDS,
  STACKABLE_ITEM_CONFIGS,
} from '../constants/inventory';
import { DEFAULT_QUANTITY } from '../constants/numbers';
import { getItemById } from '../data/items';
import type { ItemPlacement } from '../types/ui';
import type { GetRandomContainerContentsProps } from '../types/utils';
import { createOccupancyGrid } from './createOccupancyGrid';
import { findFreeGridSpot } from './findFreeGridSpot';
import { markGridOccupied } from './markGridOccupied';
import { randomInt } from './randomInt';
import { shuffleArray } from './shuffleArray';

export function getRandomContainerContents(
  props: GetRandomContainerContentsProps
): ItemPlacement[] {
  const { width, height, minItems = MIN_CONTAINER_ITEMS, maxItems = MAX_CONTAINER_ITEMS } = props;

  const placements: ItemPlacement[] = [];
  const grid = createOccupancyGrid({ width, height });
  const targetCount = randomInt({ min: minItems, max: maxItems });

  // Combine and shuffle all available items
  const stackableItems = STACKABLE_ITEM_CONFIGS.map((config) => ({
    id: config.id,
    maxQty: config.maxQty,
  }));
  const singleItems = SINGLE_ITEM_IDS.map((id) => ({ id, maxQty: DEFAULT_QUANTITY }));
  const allItems = shuffleArray([...stackableItems, ...singleItems]);

  // Sort items by random factor to vary selection each time
  const sortedItems = allItems.sort(() => Math.random() - SHUFFLE_MIDPOINT);

  for (const itemConfig of sortedItems) {
    if (placements.length >= targetCount) break;

    const item = getItemById(itemConfig.id);
    if (item === undefined) continue;

    const itemWidth = item.size.width;
    const itemHeight = item.size.height;

    const spot = findFreeGridSpot({
      grid,
      gridWidth: width,
      gridHeight: height,
      itemWidth,
      itemHeight,
    });

    if (spot === null) continue;

    markGridOccupied({
      grid,
      x: spot.x,
      y: spot.y,
      itemWidth,
      itemHeight,
    });

    const quantity =
      itemConfig.maxQty > DEFAULT_QUANTITY
        ? randomInt({ min: DEFAULT_QUANTITY, max: itemConfig.maxQty })
        : DEFAULT_QUANTITY;

    placements.push({
      id: itemConfig.id,
      x: spot.x,
      y: spot.y,
      quantity,
    });
  }

  return placements;
}
