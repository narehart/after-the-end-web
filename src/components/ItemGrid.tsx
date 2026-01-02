import type { MutableRefObject } from 'react';
import { useRef, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import { CELL_GAP } from '../constants/grid';
import { useInventoryStore } from '../stores/inventoryStore';
import type { GridCell, MenuSource } from '../types/inventory';
import { getCellValue } from '../utils/getCellValue';
import { checkIsOrigin } from '../utils/checkIsOrigin';
import ItemGridCell from './ItemGridCell';
import styles from './ItemGrid.module.css';

const cx = classNames.bind(styles);

interface ItemGridProps {
  grid: GridCell;
  context: MenuSource;
  cellSize: number;
}

interface FocusedCell {
  x: number;
  y: number;
}

export default function ItemGrid({ grid, context, cellSize }: ItemGridProps): React.JSX.Element {
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
      <div
        className={cx('inventory-grid')}
        style={{
          gridTemplateColumns: `repeat(${grid.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.height}, ${cellSize}px)`,
          gap: `${CELL_GAP}px`,
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
            const isOrigin = checkIsOrigin(grid, itemId, col, row, renderedItems);
            return (
              <ItemGridCell
                key={cellKey}
                x={col}
                y={row}
                itemId={itemId}
                isOrigin={isOrigin}
                item={isOrigin && item !== undefined ? item : null}
                isFocused={isFocused}
                onNavigate={handleNavigate}
                cellRef={(el: HTMLDivElement | null): void => {
                  cellRefs.current[cellKey] = el;
                }}
                context={context}
                cellSize={cellSize}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
