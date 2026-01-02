import { useState, useEffect } from 'react';

const GRID_COLUMNS = 10;
const CELL_GAP = 2;
const GRID_BORDER = 4;
const CONTENT_PADDING = 16;
const MIN_CELL_SIZE = 24;

export default function useCellSize(containerRef, effectiveResolution) {
  const [cellSize, setCellSize] = useState(32);

  useEffect(() => {
    const calculateCellSize = () => {
      if (containerRef.current) {
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
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [containerRef, effectiveResolution]);

  return cellSize;
}
