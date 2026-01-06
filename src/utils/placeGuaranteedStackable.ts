import { MIN_GUARANTEED_QUANTITY, STACKABLE_ITEM_CONFIGS } from '../constants/inventory';
import type { GridDimensionsProps, GridOccupancy, ItemPlacement } from '../types/inventory';
import { randomInt } from './randomInt';
import { shuffleArray } from './shuffleArray';
import { tryPlaceItem } from './tryPlaceItem';

interface PlaceGuaranteedStackableProps extends GridDimensionsProps {
  grid: GridOccupancy;
}

type PlaceGuaranteedStackableReturn = ItemPlacement | null;

export function placeGuaranteedStackable(
  props: PlaceGuaranteedStackableProps
): PlaceGuaranteedStackableReturn {
  const { grid, gridWidth, gridHeight } = props;

  const shuffledStackables = shuffleArray([...STACKABLE_ITEM_CONFIGS]);
  for (const config of shuffledStackables) {
    const quantity = randomInt({ min: MIN_GUARANTEED_QUANTITY, max: config.maxQty });
    const placement: ItemPlacement | null = tryPlaceItem({
      grid,
      gridWidth,
      gridHeight,
      itemId: config.id,
      quantity,
    });
    if (placement !== null) {
      return placement;
    }
  }

  return null;
}
