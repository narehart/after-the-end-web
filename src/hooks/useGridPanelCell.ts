import { useCallback, useMemo } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import type { Item, MenuSource } from '../types/inventory';
import type { GridPanelCellState } from '../types/ui';
import { getModalPosition } from '../utils/getModalPosition';

interface UseGridPanelCellProps {
  gridId: string;
  x: number;
  y: number;
  itemId: string | null;
  item: Item | null;
  onNavigate: (x: number, y: number) => void;
}

interface UseGridPanelCellReturn {
  cellState: GridPanelCellState;
  handleClick: () => void;
  openModal: (element: HTMLElement) => void;
  handleFocus: () => void;
  setSelectedItem: (itemId: string | null) => void;
}

export default function useGridPanelCell({
  gridId,
  x,
  y,
  itemId,
  item,
  onNavigate,
}: UseGridPanelCellProps): UseGridPanelCellReturn {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openMenu = useInventoryStore((state) => state.openMenu);

  const context: MenuSource = gridId === 'ground' ? 'ground' : 'grid';

  const cellState = useMemo(
    (): GridPanelCellState => ({
      isSelected: itemId !== null && itemId === selectedItemId,
      hasGrid: item?.gridSize !== undefined,
    }),
    [itemId, selectedItemId, item]
  );

  const handleClick = useCallback((): void => {
    if (itemId !== null) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  const openModal = useCallback(
    (element: HTMLElement): void => {
      if (itemId !== null) {
        openMenu(getModalPosition(element), itemId, null, context);
      }
    },
    [itemId, context, openMenu]
  );

  const handleFocus = useCallback((): void => {
    if (itemId !== null) setSelectedItem(itemId);
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
