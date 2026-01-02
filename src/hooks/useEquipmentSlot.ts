import { useMemo, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import type { Item, SlotType } from '../types/inventory';

interface Position {
  x: number;
  y: number;
}

function getModalPosition(element: HTMLElement): Position {
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}

interface SlotState {
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
  isFocused: boolean;
  isHovered: boolean;
  hasOpenModal: boolean;
}

interface UseEquipmentSlotReturn {
  slotState: SlotState;
  handleClick: () => void;
  openModal: (element: HTMLElement) => void;
  handleMouseEnter: () => void;
}

export default function useEquipmentSlot(slotType: SlotType): UseEquipmentSlotReturn {
  const equipment = useInventoryStore((state) => state.equipment);
  const items = useInventoryStore((state) => state.items);
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusOnEquipmentSlot = useInventoryStore((state) => state.focusOnEquipmentSlot);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const setFocusedEmptySlot = useInventoryStore((state) => state.setFocusedEmptySlot);
  const openMenu = useInventoryStore((state) => state.openMenu);
  const menuIsOpen = useInventoryStore((state) => state.menu.isOpen);
  const menuItemId = useInventoryStore((state) => state.menu.itemId);

  const itemId = equipment[slotType];
  const item = itemId !== null ? (items[itemId] ?? null) : null;
  const hasOpenModal = menuIsOpen && menuItemId === itemId;

  const slotState = useMemo(
    (): SlotState => ({
      item,
      itemId,
      hasGrid: item?.gridSize !== undefined,
      isFocused: inventoryFocusPath[0] === itemId,
      isHovered: itemId !== null && itemId === selectedItemId,
      hasOpenModal,
    }),
    [item, itemId, inventoryFocusPath, selectedItemId, hasOpenModal]
  );

  const handleClick = useCallback((): void => {
    if (item !== null && itemId !== null) {
      setSelectedItem(itemId);
      if (slotState.hasGrid) {
        focusOnEquipmentSlot(slotType);
      }
    }
  }, [item, itemId, slotState.hasGrid, setSelectedItem, focusOnEquipmentSlot, slotType]);

  const openModal = useCallback(
    (element: HTMLElement): void => {
      if (item !== null && itemId !== null) {
        setSelectedItem(itemId);
        openMenu(getModalPosition(element), itemId, slotType, 'equipment');
      }
    },
    [item, itemId, slotType, setSelectedItem, openMenu]
  );

  const handleMouseEnter = useCallback((): void => {
    if (item !== null && itemId !== null) {
      setSelectedItem(itemId);
    } else {
      setFocusedEmptySlot(slotType);
    }
  }, [item, itemId, slotType, setSelectedItem, setFocusedEmptySlot]);

  return {
    slotState,
    handleClick,
    openModal,
    handleMouseEnter,
  };
}
