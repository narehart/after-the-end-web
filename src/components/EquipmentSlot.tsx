import type { MouseEvent, KeyboardEvent } from 'react';
import { useRef } from 'react';
import classNames from 'classnames/bind';
import useEquipmentSlot from '../hooks/useEquipmentSlot';
import type { SlotType } from '../types/inventory';
import { getImageUrl } from '../utils/images';
import { getMainImage } from '../utils/getMainImage';
import { formatSlotLabel } from '../utils/formatSlotLabel';
import { Icon, ListItem } from './primitives';
import styles from './EquipmentSlot.module.css';

const cx = classNames.bind(styles);

interface EquipmentSlotProps {
  slotType: SlotType;
}

export default function EquipmentSlot({ slotType }: EquipmentSlotProps): React.JSX.Element {
  const slotRef = useRef<HTMLButtonElement | null>(null);
  const { slotState, handleClick, openModal, handleMouseEnter } = useEquipmentSlot({ slotType });
  const { item, hasGrid, isFocused } = slotState;

  const handleDoubleClick = (): void => {
    if (slotRef.current !== null) {
      openModal(slotRef.current);
    }
  };

  const handleContextMenu = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (slotRef.current !== null) {
      openModal(slotRef.current);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter' && item !== null && slotRef.current !== null) {
      openModal(slotRef.current);
    }
  };

  const state = {
    isActive: isFocused,
    isEmpty: item === null,
  };

  const icon =
    item !== null && item.image !== '' ? (
      <Icon
        src={getImageUrl(getMainImage({ allImages: item.allImages }))}
        alt={item.description}
        size="fill"
        pixelated
      />
    ) : null;

  return (
    <ListItem
      itemRef={slotRef}
      icon={icon}
      label={formatSlotLabel({ slotType })}
      hasArrow={hasGrid}
      state={state}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      className={cx('equipment-slot')}
    />
  );
}
