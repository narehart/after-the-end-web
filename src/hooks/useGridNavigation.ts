/* eslint-disable local/types-in-types-directory -- Hook-specific types */
import type { MutableRefObject } from 'react';
import { useRef, useState, useCallback } from 'react';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/array';

interface FocusedCell {
  x: number;
  y: number;
}

interface UseGridNavigationProps {
  width: number;
  height: number;
}

interface UseGridNavigationReturn {
  focusedCell: FocusedCell;
  cellRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
  handleNavigate: (x: number, y: number) => void;
  handleGridKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  setCellRef: (key: string, el: HTMLDivElement | null) => void;
}

export default function useGridNavigation({
  width,
  height,
}: UseGridNavigationProps): UseGridNavigationReturn {
  const [focusedCell, setFocusedCell] = useState<FocusedCell>({
    x: FIRST_INDEX,
    y: FIRST_INDEX,
  });
  const cellRefs: MutableRefObject<Record<string, HTMLDivElement | null>> = useRef({});

  const handleNavigate = useCallback((x: number, y: number): void => {
    setFocusedCell({ x, y });
  }, []);

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      let newX = focusedCell.x;
      let newY = focusedCell.y;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newY = Math.max(FIRST_INDEX, focusedCell.y - SECOND_INDEX);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newY = Math.min(height - SECOND_INDEX, focusedCell.y + SECOND_INDEX);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newX = Math.max(FIRST_INDEX, focusedCell.x - SECOND_INDEX);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newX = Math.min(width - SECOND_INDEX, focusedCell.x + SECOND_INDEX);
          break;
        default:
          return;
      }

      setFocusedCell({ x: newX, y: newY });
      const cellKey = `${newX}-${newY}`;
      const cellEl = cellRefs.current[cellKey];
      if (cellEl !== null && cellEl !== undefined) {
        cellEl.focus();
      }
    },
    [focusedCell, width, height]
  );

  const setCellRef = useCallback((key: string, el: HTMLDivElement | null): void => {
    cellRefs.current[key] = el;
  }, []);

  return {
    focusedCell,
    cellRefs,
    handleNavigate,
    handleGridKeyDown,
    setCellRef,
  };
}
