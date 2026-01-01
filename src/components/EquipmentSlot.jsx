import { useRef } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import './EquipmentSlot.css';

export default function EquipmentSlot({ slotType }) {
  const equipment = useInventoryStore((state) => state.equipment);
  const items = useInventoryStore((state) => state.items);
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusOnEquipmentSlot = useInventoryStore((state) => state.focusOnEquipmentSlot);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const setFocusedEmptySlot = useInventoryStore((state) => state.setFocusedEmptySlot);
  const openActionModal = useInventoryStore((state) => state.openActionModal);
  const actionModal = useInventoryStore((state) => state.actionModal);
  const slotRef = useRef(null);

  const itemId = equipment[slotType];
  const item = itemId ? items[itemId] : null;
  const hasGrid = item?.gridSize != null;
  const isFocused = inventoryFocusPath[0] === itemId;
  const isHovered = itemId && itemId === selectedItemId; // Global unified hover state
  const hasOpenModal = actionModal.isOpen && actionModal.itemId === itemId;

  const handleClick = () => {
    if (item) {
      setSelectedItem(itemId);
      // If it's a container, also navigate to it
      if (hasGrid) {
        focusOnEquipmentSlot(slotType);
      }
    }
  };

  const handleDoubleClick = (e) => {
    if (item) {
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right, y: rect.top }, 'equipment');
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (item) {
      setSelectedItem(itemId);
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right, y: rect.top }, 'equipment');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && item) {
      setSelectedItem(itemId);
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right, y: rect.top }, 'equipment');
    }
  };

  const handleMouseEnter = () => {
    if (item) {
      setSelectedItem(itemId);
    } else {
      setFocusedEmptySlot(slotType);
    }
  };

  return (
    <div
      ref={slotRef}
      className={`equipment-slot ${item ? 'equipped' : 'empty'} ${isFocused ? 'focused' : ''} ${isHovered && !hasOpenModal ? 'keyboard-focused' : ''} ${hasOpenModal ? 'has-modal' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      tabIndex={0}
      role="option"
      aria-selected={isHovered}
    >
      <span className="slot-icon">
        {item?.image && (
          <img
            src={`/src/assets/items/${item.image}`}
            alt={item.name}
            className="slot-sprite"
            draggable={false}
          />
        )}
      </span>
      <span className="slot-item">{item?.name}</span>
      {hasGrid && <span className="slot-arrow">›</span>}
    </div>
  );
}
