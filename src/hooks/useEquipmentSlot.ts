/* eslint-disable local/types-in-types-directory -- Hook-specific types */
import type { MouseEvent, KeyboardEvent, MutableRefObject } from 'react';
import type { SlotType, Item } from '../types/inventory';
import useSlotItem from './useSlotItem';
import useSlotFocus from './useSlotFocus';
import useSlotHandlers from './useSlotHandlers';

export interface SlotState {
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
  isFocused: boolean;
  isHovered: boolean;
  hasOpenModal: boolean;
}

interface UseEquipmentSlotProps {
  slotType: SlotType;
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
