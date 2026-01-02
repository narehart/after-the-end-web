import { useCallback, useMemo } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';

function getModalPosition(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.right, y: rect.top };
}

export default function useGridPanelCell({ gridId, x, y, itemId, item, onNavigate }) {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openMenu = useInventoryStore((state) => state.openMenu);

  const context = gridId === 'ground' ? 'ground' : 'grid';

  const cellState = useMemo(
    () => ({
      isSelected: itemId && itemId === selectedItemId,
      hasGrid: item?.gridSize != null,
    }),
    [itemId, selectedItemId, item]
  );

  const handleClick = useCallback(() => {
    if (itemId) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  const openModal = useCallback(
    (element) => {
      if (itemId) {
        openMenu(itemId, getModalPosition(element), context);
      }
    },
    [itemId, context, openMenu]
  );

  const handleFocus = useCallback(() => {
    if (itemId) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  return {
    cellState,
    handleClick,
    openModal,
    handleFocus,
    setSelectedItem,
  };
}
