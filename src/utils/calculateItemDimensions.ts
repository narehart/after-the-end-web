import type { Item } from '../types/inventory';
import { CELL_GAP } from '../constants/ui';
import { SECOND_INDEX } from '../constants/primitives';

interface CalculateItemDimensionsProps {
  item: Item;
  cellSize: number;
}

interface CalculateItemDimensionsReturn {
  itemWidth: number;
  itemHeight: number;
}

export function calculateItemDimensions(
  props: CalculateItemDimensionsProps
): CalculateItemDimensionsReturn {
  const { item, cellSize } = props;
  const itemWidth = item.size.width * cellSize + (item.size.width - SECOND_INDEX) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - SECOND_INDEX) * CELL_GAP;
  return { itemWidth, itemHeight };
}
