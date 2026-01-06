import { getItemById } from '../data/items';
import type { GridOccupancy, ItemPlacement } from '../types/inventory';
import { findFreeGridSpot } from './findFreeGridSpot';
import { markGridOccupied } from './markGridOccupied';

interface TryPlaceItemProps {
  grid: GridOccupancy;
  gridWidth: number;
  gridHeight: number;
  itemId: string;
  quantity: number;
}

type TryPlaceItemReturn = ItemPlacement | null;

export function tryPlaceItem(props: TryPlaceItemProps): TryPlaceItemReturn {
  const { grid, gridWidth, gridHeight, itemId, quantity } = props;

  const item = getItemById(itemId);
  if (item === undefined) return null;

  const spot = findFreeGridSpot({
    grid,
    gridWidth,
    gridHeight,
    itemWidth: item.size.width,
    itemHeight: item.size.height,
  });

  if (spot === null) return null;

  markGridOccupied({
    grid,
    x: spot.x,
    y: spot.y,
    itemWidth: item.size.width,
    itemHeight: item.size.height,
  });

  const placement: ItemPlacement = {
    id: itemId,
    x: spot.x,
    y: spot.y,
    quantity,
  };

  return placement;
}
