import type { MouseEvent, KeyboardEvent } from 'react';
import { useRef } from 'react';
import classNames from 'classnames/bind';
import useEquipmentSlot from '../hooks/useEquipmentSlot';
import type { SlotType } from '../types/inventory';
import { getImageUrl } from '../utils/images';
import { getMainImage } from '../utils/getMainImage';
import { formatSlotLabel } from '../utils/formatSlotLabel';
import { Icon, ListItem, Button, Flex, Text } from './primitives';
import styles from './EquipmentSlot.module.css';

const cx = classNames.bind(styles);

interface EquipmentSlotProps {
  slotType: SlotType;
}

export default function EquipmentSlot({ slotType }: EquipmentSlotProps): React.JSX.Element {
  const slotRef = useRef<HTMLButtonElement | null>(null);
  const { slotState, handleClick, openModal, handleMouseEnter } = useEquipmentSlot({ slotType });
  const { item, hasGrid, isFocused } = slotState;
  const isEmpty = item === null;

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

  return (
    <ListItem
      active={isFocused}
      className={cx('equipment-slot', { 'equipment-slot--empty': isEmpty })}
    >
      <Button
        ref={slotRef}
        variant="ghost"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
      >
        <Flex align="center" gap="8" className={cx('equipment-slot-content')}>
          {item !== null && item.image !== '' ? (
            <Flex align="center" justify="center" className={cx('equipment-slot-icon')}>
              <Icon
                src={getImageUrl(getMainImage({ allImages: item.allImages }))}
                alt={item.description}
                size="fill"
                pixelated
              />
            </Flex>
          ) : null}
          <Text
            ellipsis
            size="base"
            type={isEmpty ? 'muted' : undefined}
            className={cx('equipment-slot-label')}
          >
            {formatSlotLabel({ slotType })}
          </Text>
          {hasGrid ? (
            <Text type="muted" className={cx('equipment-slot-arrow')}>
              ›
            </Text>
          ) : null}
        </Flex>
      </Button>
    </ListItem>
  );
}
