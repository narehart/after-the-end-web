import type { MouseEvent, KeyboardEvent, MutableRefObject } from 'react';
import type { EquipmentSlot } from '../types/equipment';
import type { SlotState } from '../types/ui';
import useSlotItem from './useSlotItem';
import useSlotFocus from './useSlotFocus';
import useSlotHandlers from './useSlotHandlers';

interface UseEquipmentSlotProps {
  slotType: EquipmentSlot;
  slotRef: MutableRefObject<HTMLButtonElement | null>;
}

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
