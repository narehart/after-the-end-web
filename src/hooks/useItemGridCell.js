import { useCallback, useMemo } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';

function getModalPosition(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}

export default function useItemGridCell({ x, y, itemId, item, context, onNavigate }) {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openMenu = useInventoryStore((state) => state.openMenu);
  const menu = useInventoryStore((state) => state.menu);

  const cellState = useMemo(
    () => ({
      isSelected: itemId && itemId === selectedItemId,
      hasOpenModal: menu.isOpen && menu.itemId === itemId,
      hasGrid: item?.gridSize != null,
    }),
    [itemId, selectedItemId, menu, item]
  );

  const handleClick = useCallback(() => {
    if (itemId) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  const openModal = useCallback(
    (element) => {
      if (itemId) {
        setSelectedItem(itemId);
        openMenu(itemId, getModalPosition(element), context);
      }
    },
    [itemId, context, setSelectedItem, openMenu]
  );

  const handleMouseEnter = useCallback(() => {
    if (itemId) setSelectedItem(itemId);
  }, [itemId, setSelectedItem]);

  const handleFocus = useCallback(() => {
    if (itemId) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  return {
    cellState,
    handleClick,
    openModal,
    handleMouseEnter,
    handleFocus,
  };
}
