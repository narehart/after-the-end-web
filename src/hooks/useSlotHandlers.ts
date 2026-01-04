import type { MouseEvent, KeyboardEvent, RefObject } from 'react';
import { useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import type { SlotType, Item } from '../types/inventory';
import { getModalPosition } from '../utils/getModalPosition';

interface UseSlotHandlersProps {
  slotType: SlotType;
  slotRef: RefObject<HTMLButtonElement | null>;
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
}

interface UseSlotHandlersReturn {
  handleClick: () => void;
  handleDoubleClick: () => void;
  handleContextMenu: (e: MouseEvent<HTMLButtonElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  handleMouseEnter: () => void;
}

export default function useSlotHandlers({
  slotType,
  slotRef,
  item,
  itemId,
  hasGrid,
}: UseSlotHandlersProps): UseSlotHandlersReturn {
  const focusOnEquipmentSlot = useInventoryStore((state) => state.focusOnEquipmentSlot);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const setFocusedEmptySlot = useInventoryStore((state) => state.setFocusedEmptySlot);
  const openMenu = useInventoryStore((state) => state.openMenu);

  const openModal = useCallback((): void => {
    if (item !== null && itemId !== null && slotRef.current !== null) {
      setSelectedItem(itemId);
      openMenu(getModalPosition({ element: slotRef.current }), itemId, slotType, 'equipment');
    }
  }, [item, itemId, slotType, slotRef, setSelectedItem, openMenu]);

  const handleClick = useCallback((): void => {
    if (item !== null && itemId !== null) {
      setSelectedItem(itemId);
      if (hasGrid) {
        focusOnEquipmentSlot(slotType);
      }
    }
  }, [item, itemId, hasGrid, setSelectedItem, focusOnEquipmentSlot, slotType]);

  const handleDoubleClick = useCallback((): void => {
    openModal();
  }, [openModal]);

  const handleContextMenu = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      openModal();
    },
    [openModal]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === 'Enter' && item !== null) {
        openModal();
      }
    },
    [item, openModal]
  );

  const handleMouseEnter = useCallback((): void => {
    if (item !== null && itemId !== null) {
      setSelectedItem(itemId);
    } else {
      setFocusedEmptySlot(slotType);
    }
  }, [item, itemId, slotType, setSelectedItem, setFocusedEmptySlot]);

  return {
    handleClick,
    handleDoubleClick,
    handleContextMenu,
    handleKeyDown,
    handleMouseEnter,
  };
}
