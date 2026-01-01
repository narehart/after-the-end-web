import { useRef } from 'react';
import useEquipmentSlot from '../hooks/useEquipmentSlot';
import './EquipmentSlot.css';

function buildClassName(slotState) {
  const { item, isFocused, isHovered, hasOpenModal } = slotState;
  const classes = ['equipment-slot'];
  classes.push(item ? 'equipped' : 'empty');
  if (isFocused) classes.push('focused');
  if (isHovered && !hasOpenModal) classes.push('keyboard-focused');
  if (hasOpenModal) classes.push('has-modal');
  return classes.join(' ');
}

export default function EquipmentSlot({ slotType }) {
  const slotRef = useRef(null);
  const { slotState, handleClick, openModal, handleMouseEnter } = useEquipmentSlot(slotType);
  const { item, hasGrid, isHovered } = slotState;

  const handleDoubleClick = () => openModal(slotRef.current);
  const handleContextMenu = (e) => {
    e.preventDefault();
    openModal(slotRef.current);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && item) {
      openModal(slotRef.current);
    }
  };

  return (
    <div
      ref={slotRef}
      className={buildClassName(slotState)}
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
