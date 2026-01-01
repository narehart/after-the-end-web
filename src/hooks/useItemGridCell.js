import { useCallback, useMemo } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';

function getModalPosition(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}

export default function useItemGridCell({ x, y, itemId, item, context, onNavigate }) {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openActionModal = useInventoryStore((state) => state.openActionModal);
  const actionModal = useInventoryStore((state) => state.actionModal);

  const cellState = useMemo(() => ({
    isSelected: itemId && itemId === selectedItemId,
    hasOpenModal: actionModal.isOpen && actionModal.itemId === itemId,
    hasGrid: item?.gridSize != null,
  }), [itemId, selectedItemId, actionModal, item]);

  const handleClick = useCallback(() => {
    if (itemId) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  const openModal = useCallback((element) => {
    if (itemId) {
      setSelectedItem(itemId);
      openActionModal(itemId, getModalPosition(element), context);
    }
  }, [itemId, context, setSelectedItem, openActionModal]);

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
