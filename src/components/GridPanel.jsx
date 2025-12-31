import { useRef, useEffect, useState, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import './GridPanel.css';

function Breadcrumb() {
  const focusPath = useInventoryStore((state) => state.focusPath);
  const items = useInventoryStore((state) => state.items);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  return (
    <div className="breadcrumb">
      {focusPath.map((containerId, index) => {
        const item = items[containerId];
        const isLast = index === focusPath.length - 1;
        return (
          <span key={containerId} className="breadcrumb-segment">
            <button
              className={`breadcrumb-link ${isLast ? 'current' : ''}`}
              onClick={() => navigateBack(index)}
              disabled={isLast}
            >
              {item?.name || containerId}
            </button>
            {!isLast && <span className="breadcrumb-separator">›</span>}
          </span>
        );
      })}
    </div>
  );
}

function GridCell({ gridId, x, y, itemId, isOrigin, item, isFocused, onNavigate, cellRef }) {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openActionModal = useInventoryStore((state) => state.openActionModal);

  const isSelected = itemId && itemId === selectedItemId;
  const hasGrid = item?.gridSize != null;
  const context = gridId === 'ground' ? 'ground' : 'grid';

  const handleClick = (e) => {
    if (itemId) {
      setSelectedItem(itemId);
    }
    onNavigate(x, y);
  };

  const handleDoubleClick = (e) => {
    if (itemId) {
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right + 8, y: rect.top }, context);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && itemId) {
      setSelectedItem(itemId);
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right + 8, y: rect.top }, context);
    }
    // Arrow navigation is handled at the grid level
  };

  const handleFocus = () => {
    if (itemId) {
      setSelectedItem(itemId);
    }
    onNavigate(x, y);
  };

  return (
    <div
      ref={cellRef}
      className={`grid-cell ${itemId ? 'occupied' : 'empty'} ${isSelected ? 'selected' : ''} ${isOrigin ? 'origin' : ''} ${isFocused ? 'keyboard-focused' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      tabIndex={isFocused ? 0 : -1}
      role="gridcell"
      aria-selected={isFocused}
    >
      {isOrigin && item && (
        <div
          className={`grid-item ${hasGrid ? 'container' : ''}`}
          style={{
            width: `${item.size.width * 100}%`,
            height: `${item.size.height * 100}%`,
          }}
        >
          <span className="item-icon">{getItemIcon(item.type)}</span>
          <span className="item-name">{item.name}</span>
          {item.stackable && item.quantity > 1 && (
            <span className="item-quantity">x{item.quantity}</span>
          )}
          {hasGrid && <span className="container-indicator">▼</span>}
        </div>
      )}
    </div>
  );
}

function getItemIcon(type) {
  const icons = {
    container: '📦',
    consumable: '💊',
    weapon: '🗡',
    clothing: '👔',
    ammo: '🔸',
    tool: '🔦',
    accessory: '🔹',
  };
  return icons[type] || '◻';
}

function InventoryGrid({ gridId, grid, label }) {
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
    <div className="inventory-grid-container">
      {label && <div className="grid-label">{label}</div>}
      <div
        className="inventory-grid"
        style={{
          gridTemplateColumns: `repeat(${grid.width}, 48px)`,
          gridTemplateRows: `repeat(${grid.height}, 48px)`,
        }}
        role="grid"
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
              <GridCell
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

export default function GridPanel({ groundRef }) {
  const focusPath = useInventoryStore((state) => state.focusPath);
  const grids = useInventoryStore((state) => state.grids);
  const groundCollapsed = useInventoryStore((state) => state.groundCollapsed);
  const toggleGroundCollapsed = useInventoryStore((state) => state.toggleGroundCollapsed);

  const currentContainerId = focusPath[focusPath.length - 1];
  const currentGrid = grids[currentContainerId];
  const groundGrid = grids['ground'];

  return (
    <div className="grid-panel">
      <Breadcrumb />

      <div className="grid-content">
        {currentGrid ? (
          <InventoryGrid gridId={currentContainerId} grid={currentGrid} />
        ) : (
          <div className="empty-grid-message">No container selected</div>
        )}
      </div>

      <div className={`ground-section ${groundCollapsed ? 'collapsed' : ''}`} ref={groundRef}>
        <button className="ground-header" onClick={toggleGroundCollapsed}>
          <span className="ground-icon">📍</span>
          <span className="ground-label">Ground - Abandoned Street</span>
          <span className="ground-toggle">{groundCollapsed ? '▲' : '▼'}</span>
        </button>
        {!groundCollapsed && groundGrid && (
          <InventoryGrid gridId="ground" grid={groundGrid} label="" />
        )}
      </div>
    </div>
  );
}
