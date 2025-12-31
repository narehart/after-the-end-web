import React, { useRef, useEffect, useState } from 'react';
import { useInventoryStore, SLOT_TYPES } from '../stores/inventoryStore';
import './EquipmentPanel.css';

function EquipmentSlot({ slotType, index, focusedIndex, onFocusChange }) {
  const equipment = useInventoryStore((state) => state.equipment);
  const items = useInventoryStore((state) => state.items);
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const focusOnEquipmentSlot = useInventoryStore((state) => state.focusOnEquipmentSlot);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const setFocusedEmptySlot = useInventoryStore((state) => state.setFocusedEmptySlot);
  const openActionModal = useInventoryStore((state) => state.openActionModal);
  const slotRef = useRef(null);

  const itemId = equipment[slotType];
  const item = itemId ? items[itemId] : null;
  const hasGrid = item?.gridSize != null;
  const isFocused = inventoryFocusPath[0] === itemId;
  const isKeyboardFocused = index === focusedIndex;

  // Focus this element when it becomes the focused index
  useEffect(() => {
    if (isKeyboardFocused && slotRef.current) {
      slotRef.current.focus();
    }
  }, [isKeyboardFocused]);

  const handleClick = () => {
    if (item) {
      setSelectedItem(itemId);
      onFocusChange(index);
      // If it's a container, also navigate to it
      if (hasGrid) {
        focusOnEquipmentSlot(slotType);
      }
    }
  };

  const handleDoubleClick = (e) => {
    if (item) {
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right + 8, y: rect.top }, 'equipment');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && item) {
      setSelectedItem(itemId);
      const rect = e.currentTarget.getBoundingClientRect();
      openActionModal(itemId, { x: rect.right + 8, y: rect.top }, 'equipment');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onFocusChange(Math.min(index + 1, SLOT_TYPES.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onFocusChange(Math.max(index - 1, 0));
    }
  };

  const handleFocus = () => {
    if (item) {
      setSelectedItem(itemId);
    } else {
      setFocusedEmptySlot(slotType);
    }
    onFocusChange(index);
  };

  return (
    <div
      ref={slotRef}
      className={`equipment-slot ${item ? 'equipped' : 'empty'} ${isFocused ? 'focused' : ''} ${isKeyboardFocused ? 'keyboard-focused' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      tabIndex={isKeyboardFocused ? 0 : -1}
      role="option"
      aria-selected={isKeyboardFocused}
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

export default function EquipmentPanel() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const equipment = useInventoryStore((state) => state.equipment);

  // Only show slots that have items equipped
  const equippedSlots = SLOT_TYPES.filter((slotType) => equipment[slotType] != null);

  return (
    <div className="equipment-panel" role="listbox" aria-label="Equipment slots">
      <h3 className="equipment-title">EQUIPMENT</h3>
      <div className="equipment-slots">
        {equippedSlots.map((slotType, index) => (
          <EquipmentSlot
            key={slotType}
            slotType={slotType}
            index={index}
            focusedIndex={focusedIndex}
            onFocusChange={setFocusedIndex}
          />
        ))}
      </div>
    </div>
  );
}
