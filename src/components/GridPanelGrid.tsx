import type { MutableRefObject } from 'react';
import { useRef, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import type { GridCell } from '../types/inventory';
import type { FocusedCell } from '../types/ui';
import { getCellValue } from '../utils/getCellValue';
import { findItemOrigin } from '../utils/findItemOrigin';
import GridPanelCell from './GridPanelCell';
import styles from './GridPanelGrid.module.css';

const cx = classNames.bind(styles);

interface GridPanelGridProps {
  gridId: string;
  grid: GridCell;
  label?: string;
}

export default function GridPanelGrid({
  gridId,
  grid,
  label,
}: GridPanelGridProps): React.JSX.Element {
  const items = useInventoryStore((state) => state.items);
  const [focusedCell, setFocusedCell] = useState<FocusedCell>({ x: 0, y: 0 });
  const cellRefs: MutableRefObject<Record<string, HTMLDivElement | null>> = useRef({});
  const renderedItems = new Set<string>();

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
          newY = Math.max(0, focusedCell.y - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newY = Math.min(grid.height - 1, focusedCell.y + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newX = Math.max(0, focusedCell.x - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newX = Math.min(grid.width - 1, focusedCell.x + 1);
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
    [focusedCell, grid.width, grid.height]
  );

  return (
    <div className={cx('inventory-grid-container')}>
      {label !== undefined && label !== '' ? <div className={cx('grid-label')}>{label}</div> : null}
      <div
        className={cx('inventory-grid')}
        style={{
          gridTemplateColumns: `repeat(${grid.width}, 48px)`,
          gridTemplateRows: `repeat(${grid.height}, 48px)`,
        }}
        role="grid"
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
      >
        {Array.from({ length: grid.height }).map((__, row) =>
          Array.from({ length: grid.width }).map((___, col) => {
            const itemId = getCellValue(grid, row, col);
            const item = itemId !== null ? items[itemId] : undefined;
            const cellKey = `${col}-${row}`;
            const isFocused = focusedCell.x === col && focusedCell.y === row;
            let isOrigin = false;
            if (itemId !== null && !renderedItems.has(itemId)) {
              const origin = findItemOrigin(grid, itemId);
              if (origin !== null && origin.x === col && origin.y === row) {
                isOrigin = true;
                renderedItems.add(itemId);
              }
            }
            return (
              <GridPanelCell
                key={cellKey}
                gridId={gridId}
                x={col}
                y={row}
                itemId={itemId}
                isOrigin={isOrigin}
                item={isOrigin && item !== undefined ? item : null}
                isFocused={isFocused}
                onNavigate={handleNavigate}
                cellRef={(el): void => {
                  cellRefs.current[cellKey] = el;
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
