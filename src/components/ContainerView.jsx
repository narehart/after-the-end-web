import { useRef, useState, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import './ContainerView.css';

const CELL_GAP = 2; // Gap between cells in pixels
const GRID_PADDING = 4; // Padding around grid in pixels

function PanelHeader({ panelIcon, panelLabel, focusPath, onNavigateBack, items, panelType }) {
  // For world panel at ground level, don't show redundant "ground" breadcrumb
  const isGroundRoot = panelType === 'world' && focusPath.length === 1 && focusPath[0] === 'ground';
  const showBreadcrumb = focusPath.length > 0 && !isGroundRoot;

  return (
    <div className="panel-header">
      <span className="panel-icon">{panelIcon}</span>
      <span className="panel-label">{panelLabel}</span>
      {showBreadcrumb && (
        <>
          <span className="breadcrumb-separator">›</span>
          {focusPath.map((containerId, index) => {
            const item = items[containerId];
            const isLast = index === focusPath.length - 1;
            return (
              <span key={containerId} className="breadcrumb-segment">
                <button
                  className={`breadcrumb-link ${isLast ? 'current' : ''}`}
                  onClick={() => onNavigateBack(index)}
                  disabled={isLast}
                >
                  {item?.name || containerId}
                </button>
                {!isLast && <span className="breadcrumb-separator">›</span>}
              </span>
            );
          })}
        </>
      )}
    </div>
  );
}

function GridCell({ gridId, x, y, itemId, isOrigin, item, isFocused, onNavigate, cellRef, context, cellSize }) {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openActionModal = useInventoryStore((state) => state.openActionModal);

  const isSelected = itemId && itemId === selectedItemId;
  const hasGrid = item?.gridSize != null;

  const handleClick = () => {
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
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      tabIndex={isFocused ? 0 : -1}
      role="gridcell"
      aria-selected={isFocused}
    >
      {isOrigin && item && (() => {
        // Rotate sprite if item is vertical BUT sprite is horizontal (not already vertical)
        const needsRotation = item.size.height > item.size.width && !item.spriteVertical;
        // Account for gaps between cells in multi-cell items
        const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
        const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
        return (
          <div
            className={`grid-item ${hasGrid ? 'container' : ''}`}
            style={{
              width: `${itemWidth}px`,
              height: `${itemHeight}px`,
              '--item-width': `${itemWidth}px`,
              '--item-height': `${itemHeight}px`,
            }}
          >
            {item.image ? (
              <img
                src={`/src/assets/items/${item.image}`}
                alt={item.name}
                className={`item-image ${needsRotation ? 'rotated' : ''}`}
                draggable={false}
              />
            ) : (
              <span className="item-icon">{getItemIcon(item.type)}</span>
            )}
            {item.stackable && item.quantity > 1 && (
              <span className="item-quantity">x{item.quantity}</span>
            )}
            {hasGrid && <span className="container-indicator">▼</span>}
          </div>
        );
      })()}
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

function InventoryGrid({ gridId, grid, context, cellSize }) {
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
          padding: `${GRID_PADDING}px`,
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

// Main ContainerView component - reusable for both inventory and world panels
export default function ContainerView({
  focusPath,
  onNavigateBack,
  emptyMessage = 'No container selected',
  panelType = 'inventory', // 'inventory' | 'world'
  panelIcon = '📦',
  panelLabel = 'Container',
  cellSize = 32
}) {
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);

  const currentContainerId = focusPath.length > 0 ? focusPath[focusPath.length - 1] : null;
  const currentGrid = currentContainerId ? grids[currentContainerId] : null;

  // Determine context for action modal based on panel type and current container
  const getContext = () => {
    if (panelType === 'world') {
      return currentContainerId === 'ground' ? 'ground' : 'world';
    }
    return 'grid';
  };

  return (
    <div className="container-view">
      <PanelHeader
        panelIcon={panelIcon}
        panelLabel={panelLabel}
        focusPath={focusPath}
        onNavigateBack={onNavigateBack}
        items={items}
        panelType={panelType}
      />

      <div className="container-view-content">
        {currentGrid ? (
          <InventoryGrid
            gridId={currentContainerId}
            grid={currentGrid}
            context={getContext()}
            cellSize={cellSize}
          />
        ) : (
          <div className="empty-container-message">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
}
