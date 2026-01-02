import type { RefObject } from 'react';
import { useState, useEffect } from 'react';
import {
  GRID_COLUMNS,
  CELL_GAP,
  GRID_BORDER,
  CONTENT_PADDING,
  MIN_CELL_SIZE,
} from '../constants/grid';

interface Resolution {
  width: number;
  height: number;
}

export default function useCellSize(
  containerRef: RefObject<HTMLDivElement | null>,
  effectiveResolution: Resolution
): number {
  const [cellSize, setCellSize] = useState(32);

  useEffect(() => {
    const calculateCellSize = (): void => {
      if (containerRef.current !== null) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth > 0) {
          const totalGaps = (GRID_COLUMNS - 1) * CELL_GAP;
          const availableWidth = containerWidth - GRID_BORDER - totalGaps - CONTENT_PADDING;
          const newCellSize = Math.floor(availableWidth / GRID_COLUMNS);
          setCellSize(Math.max(MIN_CELL_SIZE, newCellSize));
        }
      }
    };

    const timeoutId = setTimeout(calculateCellSize, 10);
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
