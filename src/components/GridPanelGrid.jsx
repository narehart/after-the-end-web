import { useRef, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import GridPanelCell from './GridPanelCell';
import styles from './GridPanelGrid.module.css';

const cx = classNames.bind(styles);

export default function GridPanelGrid({ gridId, grid, label }) {
  const items = useInventoryStore((state) => state.items);
  const [focusedCell, setFocusedCell] = useState({ x: 0, y: 0 });
  const cellRefs = useRef({});

  // Track which cells have already been rendered as part of multi-cell items
  const renderedItems = new Set();

  // Find origin position for each item
  const findOrigin = (itemId) => {
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        if (grid.cells[row][col] === itemId) {
          return { x: col, y: row };
        }
      }
    }
    return null;
  };

  const handleNavigate = useCallback((x, y) => {
    setFocusedCell({ x, y });
  }, []);

  // Handle arrow key navigation at the grid level
  const handleGridKeyDown = useCallback((e) => {
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
    if (cellRefs.current[cellKey]) {
      cellRefs.current[cellKey].focus();
    }
  }, [focusedCell, grid.width, grid.height]);

  return (
    <div className={cx('inventory-grid-container')}>
      {label && <div className={cx('grid-label')}>{label}</div>}
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
        {Array.from({ length: grid.height }).map((_, row) =>
          Array.from({ length: grid.width }).map((_, col) => {
            const itemId = grid.cells[row][col];
            const item = itemId ? items[itemId] : null;
            const cellKey = `${col}-${row}`;
            const isFocused = focusedCell.x === col && focusedCell.y === row;

            // Check if this is the origin of the item
            let isOrigin = false;
            if (itemId && !renderedItems.has(itemId)) {
              const origin = findOrigin(itemId);
              if (origin && origin.x === col && origin.y === row) {
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
                item={isOrigin ? item : null}
                isFocused={isFocused}
                onNavigate={handleNavigate}
                cellRef={(el) => { cellRefs.current[cellKey] = el; }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
