import { useMemo, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';

function getModalPosition(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}

export default function useEquipmentSlot(slotType) {
  const equipment = useInventoryStore((state) => state.equipment);
  const items = useInventoryStore((state) => state.items);
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const focusOnEquipmentSlot = useInventoryStore((state) => state.focusOnEquipmentSlot);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const setFocusedEmptySlot = useInventoryStore((state) => state.setFocusedEmptySlot);
  const openMenu = useInventoryStore((state) => state.openMenu);
  const menu = useInventoryStore((state) => state.menu);

  const itemId = equipment[slotType];
  const item = itemId ? items[itemId] : null;

  const slotState = useMemo(() => ({
    item,
    itemId,
    hasGrid: item?.gridSize != null,
    isFocused: inventoryFocusPath[0] === itemId,
    isHovered: itemId && itemId === selectedItemId,
    hasOpenModal: menu.isOpen && menu.itemId === itemId,
  }), [item, itemId, inventoryFocusPath, selectedItemId, menu]);

  const handleClick = useCallback(() => {
    if (item) {
      setSelectedItem(itemId);
      if (slotState.hasGrid) {
        focusOnEquipmentSlot(slotType);
      }
    }
  }, [item, itemId, slotState.hasGrid, setSelectedItem, focusOnEquipmentSlot, slotType]);

  const openModal = useCallback((element) => {
    if (item) {
      setSelectedItem(itemId);
      openMenu(itemId, getModalPosition(element), 'equipment');
    }
  }, [item, itemId, setSelectedItem, openMenu]);

  const handleMouseEnter = useCallback(() => {
    if (item) {
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
