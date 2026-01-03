import type { RefObject } from 'react';
import { useState, useEffect } from 'react';
import {
  GRID_COLUMNS,
  CELL_GAP,
  GRID_BORDER,
  CONTENT_PADDING,
  MIN_CELL_SIZE,
} from '../constants/grid';
import { FIRST_INDEX, SECOND_INDEX, RESIZE_DEBOUNCE_MS } from '../constants/numbers';
import type { UseCellSizeProps } from '../types/utils';

export default function useCellSize(
  containerRef: RefObject<HTMLDivElement | null>,
  props: UseCellSizeProps
): number | null {
  const { resolution: effectiveResolution } = props;
  const [cellSize, setCellSize] = useState<number | null>(null);

  useEffect(() => {
    const calculateCellSize = (): void => {
      if (containerRef.current !== null) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > FIRST_INDEX) {
          const totalGaps = (GRID_COLUMNS - SECOND_INDEX) * CELL_GAP;
          const availableWidth = containerWidth - GRID_BORDER - totalGaps - CONTENT_PADDING;
          const newCellSize = Math.floor(availableWidth / GRID_COLUMNS);
          setCellSize(Math.max(MIN_CELL_SIZE, newCellSize));
        }
      }
    };

    const timeoutId = setTimeout(calculateCellSize, RESIZE_DEBOUNCE_MS);
    const resizeObserver = new ResizeObserver(calculateCellSize);
    if (containerRef.current !== null) {
      resizeObserver.observe(containerRef.current);
    }
    return (): void => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [containerRef, effectiveResolution]);

  return cellSize;
}
