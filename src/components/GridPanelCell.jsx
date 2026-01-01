import { useInventoryStore } from '../stores/inventoryStore';
import './GridPanelCell.css';

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

export default function GridPanelCell({ gridId, x, y, itemId, isOrigin, item, isFocused, onNavigate, cellRef }) {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openActionModal = useInventoryStore((state) => state.openActionModal);

  const isSelected = itemId && itemId === selectedItemId;
  const hasGrid = item?.gridSize != null;
  const context = gridId === 'ground' ? 'ground' : 'grid';

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && itemId) {
      setSelectedItem(itemId);
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right, y: rect.top }, context);
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
