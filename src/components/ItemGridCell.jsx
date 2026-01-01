import { useInventoryStore } from '../stores/inventoryStore';
import './ItemGridCell.css';

const CELL_GAP = 2; // Gap between cells in pixels

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

export default function ItemGridCell({ x, y, itemId, isOrigin, item, isFocused, onNavigate, cellRef, context, cellSize }) {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openActionModal = useInventoryStore((state) => state.openActionModal);
  const actionModal = useInventoryStore((state) => state.actionModal);

  const isSelected = itemId && itemId === selectedItemId;
  const hasOpenModal = actionModal.isOpen && actionModal.itemId === itemId;
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
      openActionModal(itemId, { x: rect.right, y: rect.top }, context);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (itemId) {
      setSelectedItem(itemId);
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right, y: rect.top }, context);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && itemId) {
      setSelectedItem(itemId);
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right, y: rect.top }, context);
    }
  };

  const handleMouseEnter = () => {
    if (itemId) {
      setSelectedItem(itemId);
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
      className="grid-cell"
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
      role="gridcell"
    >
      {isOrigin && item && (() => {
        // Rotate sprite if item is vertical BUT sprite is horizontal (not already vertical)
        const needsRotation = item.size.height > item.size.width && !item.spriteVertical;
        // Account for gaps between cells in multi-cell items
        const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
        const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
        return (
          <button
            type="button"
            className={`grid-item ${hasGrid ? 'container' : ''} ${isSelected ? 'selected' : ''} ${hasOpenModal ? 'has-modal' : ''}`}
            style={{
              width: `${itemWidth}px`,
              height: `${itemHeight}px`,
              '--item-width': `${itemWidth}px`,
              '--item-height': `${itemHeight}px`,
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
            onKeyDown={handleKeyDown}
            onMouseEnter={handleMouseEnter}
            onFocus={handleFocus}
            tabIndex={isFocused ? 0 : -1}
            aria-label={item.name}
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
          </button>
        );
      })()}
    </div>
  );
}
