import type { CalculateItemDimensionsProps, CalculateItemDimensionsReturn } from '../types/utils';
import { CELL_GAP } from '../constants/grid';
import { SECOND_INDEX } from '../constants/numbers';

export function calculateItemDimensions(
  props: CalculateItemDimensionsProps
): CalculateItemDimensionsReturn {
  const { item, cellSize } = props;
  const itemWidth = item.size.width * cellSize + (item.size.width - SECOND_INDEX) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - SECOND_INDEX) * CELL_GAP;
  return { itemWidth, itemHeight };
}
