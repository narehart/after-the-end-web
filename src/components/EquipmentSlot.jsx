import { useRef } from 'react';
import useEquipmentSlot from '../hooks/useEquipmentSlot';
import ListItem from './ListItem';
import './EquipmentSlot.css';

export default function EquipmentSlot({ slotType }) {
  const slotRef = useRef(null);
  const { slotState, handleClick, openModal, handleMouseEnter } = useEquipmentSlot(slotType);
  const { item, hasGrid, isFocused } = slotState;

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

  const state = {
    isActive: isFocused,
    isEmpty: !item,
  };

  const icon = item?.image ? (
    <img src={`/src/assets/items/${item.image}`} alt={item.name} draggable={false} />
  ) : null;

  return (
    <ListItem
      itemRef={slotRef}
      icon={icon}
      label={item?.name}
      hasArrow={hasGrid}
      state={state}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      className="equipment-slot"
    />
  );
}
