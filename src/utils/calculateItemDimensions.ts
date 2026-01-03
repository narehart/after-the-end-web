import type { CalculateItemDimensionsProps, CalculateItemDimensionsReturn } from '../types/utils';
import { CELL_GAP } from '../constants/grid';

export function calculateItemDimensions(
  props: CalculateItemDimensionsProps
): CalculateItemDimensionsReturn {
  const { item, cellSize } = props;
  const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
  return { itemWidth, itemHeight };
}
