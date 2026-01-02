import { useRef, useState, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import ItemGridCell from './ItemGridCell';
import './ItemGrid.css';

const CELL_GAP = 2; // Gap between cells in pixels

export default function ItemGrid({ grid, context, cellSize }) {
  const items = useInventoryStore((state) => state.items);
  const [focusedCell, setFocusedCell] = useState({ x: 0, y: 0 });
  const cellRefs = useRef({});

  const renderedItems = new Set();

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
    <div className="inventory-grid-container">
      <div
        className="inventory-grid"
        style={{
          gridTemplateColumns: `repeat(${grid.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.height}, ${cellSize}px)`,
          gap: `${CELL_GAP}px`,
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

            let isOrigin = false;
            if (itemId && !renderedItems.has(itemId)) {
              const origin = findOrigin(itemId);
              if (origin && origin.x === col && origin.y === row) {
                isOrigin = true;
                renderedItems.add(itemId);
              }
            }

            return (
              <ItemGridCell
                key={cellKey}
                x={col}
                y={row}
                itemId={itemId}
                isOrigin={isOrigin}
                item={isOrigin ? item : null}
                isFocused={isFocused}
                onNavigate={handleNavigate}
                cellRef={(el) => { cellRefs.current[cellKey] = el; }}
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
