import { SHUFFLE_MIDPOINT, SINGLE_ITEM_IDS, STACKABLE_ITEM_CONFIGS } from '../constants/inventory';
import { DEFAULT_QUANTITY } from '../constants/items';
import type { GridOccupancy, ItemPlacement } from '../types/ui';
import { randomInt } from './randomInt';
import { shuffleArray } from './shuffleArray';
import { tryPlaceItem } from './tryPlaceItem';

interface FillContainerWithItemsProps {
  grid: GridOccupancy;
  gridWidth: number;
  gridHeight: number;
  targetCount: number;
  excludeId?: string;
}

export function fillContainerWithItems(props: FillContainerWithItemsProps): ItemPlacement[] {
  const { grid, gridWidth, gridHeight, targetCount, excludeId } = props;
  const placements: ItemPlacement[] = [];

  const stackableItems = STACKABLE_ITEM_CONFIGS.map((c) => ({ id: c.id, maxQty: c.maxQty }));
  const singleItems = SINGLE_ITEM_IDS.map((id) => ({ id, maxQty: DEFAULT_QUANTITY }));
  const allItems = shuffleArray([...stackableItems, ...singleItems]);
  const sortedItems = allItems.sort(() => Math.random() - SHUFFLE_MIDPOINT);

  for (const itemConfig of sortedItems) {
    if (placements.length >= targetCount) break;
    if (excludeId !== undefined && itemConfig.id === excludeId) continue;

    const quantity =
      itemConfig.maxQty > DEFAULT_QUANTITY
        ? randomInt({ min: DEFAULT_QUANTITY, max: itemConfig.maxQty })
        : DEFAULT_QUANTITY;

    const placement = tryPlaceItem({
      grid,
      gridWidth,
      gridHeight,
      itemId: itemConfig.id,
      quantity,
    });
    if (placement !== null) {
      placements.push(placement);
    }
  }

  return placements;
}
