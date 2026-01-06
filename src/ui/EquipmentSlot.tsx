import { useRef } from 'react';
import useEquipmentSlot from '../hooks/useEquipmentSlot';
import type { EquipmentSlot as EquipmentSlotType } from '../types/equipment';
import { getItemImageUrl } from '../utils/getItemImageUrl';
import { formatSlotLabel } from '../utils/formatSlotLabel';
import { Icon, ListItem, Button, Flex, Text } from '.';

interface EquipmentSlotProps {
  slotType: EquipmentSlotType;
}

export default function EquipmentSlot({ slotType }: EquipmentSlotProps): React.JSX.Element {
  const slotRef = useRef<HTMLButtonElement | null>(null);
  const {
    slotState,
    handleClick,
    handleDoubleClick,
    handleContextMenu,
    handleKeyDown,
    handleMouseEnter,
  } = useEquipmentSlot({ slotType, slotRef });

  const { item, hasGrid, isFocused, hasOpenModal } = slotState;

  return (
    <ListItem selected={isFocused} active={hasOpenModal}>
      <Button
        ref={slotRef}
        variant="ghost"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
      >
        <Flex align="center" gap="8">
          {item !== null && item.image !== '' ? (
            <Icon
              src={getItemImageUrl({ allImages: item.allImages })}
              alt={item.description}
              size="lg"
              pixelated
            />
          ) : null}
          <Text ellipsis size="base" grow>
            {formatSlotLabel({ slotType })}
          </Text>
          {hasGrid ? (
            <Text type="muted" size="lg">
              ›
            </Text>
          ) : null}
        </Flex>
      </Button>
    </ListItem>
  );
}
