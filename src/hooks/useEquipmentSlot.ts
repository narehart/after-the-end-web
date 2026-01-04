import type { MouseEvent, KeyboardEvent } from 'react';
import type { SlotState } from '../types/ui';
import type { UseEquipmentSlotProps } from '../types/utils';
import useSlotItem from './useSlotItem';
import useSlotFocus from './useSlotFocus';
import useSlotHandlers from './useSlotHandlers';

interface UseEquipmentSlotReturn {
  slotState: SlotState;
  handleClick: () => void;
  handleDoubleClick: () => void;
  handleContextMenu: (e: MouseEvent<HTMLButtonElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  handleMouseEnter: () => void;
}

export default function useEquipmentSlot({
  slotType,
  slotRef,
}: UseEquipmentSlotProps): UseEquipmentSlotReturn {
  const { item, itemId, hasGrid } = useSlotItem({ slotType });
  const { isFocused, isHovered, hasOpenModal } = useSlotFocus({ itemId });
  const handlers = useSlotHandlers({ slotType, slotRef, item, itemId, hasGrid });

  const slotState: SlotState = {
    item,
    itemId,
    hasGrid,
    isFocused,
    isHovered,
    hasOpenModal,
  };

  return {
    slotState,
    ...handlers,
  };
}
