import { useRef } from 'react';
import useEquipmentSlot from '../hooks/useEquipmentSlot';
import type { SlotType } from '../types/inventory';
import { getItemImageUrl } from '../utils/getItemImageUrl';
import { formatSlotLabel } from '../utils/formatSlotLabel';
import { Icon, ListItem, Button, Flex, Text } from './primitives';

interface EquipmentSlotProps {
  slotType: SlotType;
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

  const { item, hasGrid, isFocused } = slotState;

  return (
    <ListItem active={isFocused}>
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
            <Text align="right" type="muted">
              ›
            </Text>
          ) : null}
        </Flex>
      </Button>
    </ListItem>
  );
}
