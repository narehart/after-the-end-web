/* eslint-disable local/types-in-types-directory -- Hook-specific types */
import { useCallback, useMemo } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import type { Item, MenuSource } from '../types/inventory';
import { getModalPosition } from '../utils/getModalPosition';

export interface CellState {
  isSelected: boolean;
  hasOpenModal: boolean;
  hasGrid: boolean;
}

export interface ItemGridHandlers {
  handleClick: () => void;
  openModal: (element: HTMLElement) => void;
  openContainer: () => void;
  handleMouseEnter: () => void;
  handleFocus: () => void;
}

interface UseItemGridCellProps {
  x: number;
  y: number;
  itemId: string | null;
  item: Item | null;
  context: MenuSource;
  onNavigate: (x: number, y: number) => void;
}

interface UseItemGridCellReturn {
  cellState: CellState;
  handleClick: () => void;
  openModal: (element: HTMLElement) => void;
  openContainer: () => void;
  handleMouseEnter: () => void;
  handleFocus: () => void;
}

export default function useItemGridCell({
  x,
  y,
  itemId,
  item,
  context,
  onNavigate,
}: UseItemGridCellProps): UseItemGridCellReturn {
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const setSelectedItem = useInventoryStore((state) => state.setSelectedItem);
  const openMenu = useInventoryStore((state) => state.openMenu);
  const navigateToContainer = useInventoryStore((state) => state.navigateToContainer);
  const menu = useInventoryStore((state) => state.menu);

  const cellState = useMemo(
    (): CellState => ({
      isSelected: itemId !== null && itemId === selectedItemId,
      hasOpenModal: menu.isOpen && menu.itemId === itemId,
      hasGrid: item?.gridSize !== undefined,
    }),
    [itemId, selectedItemId, menu, item]
  );

  const handleClick = useCallback((): void => {
    if (itemId !== null) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  const openModal = useCallback(
    (element: HTMLElement): void => {
      if (itemId !== null) {
        setSelectedItem(itemId);
        openMenu(getModalPosition({ element }), itemId, null, context);
      }
    },
    [itemId, context, setSelectedItem, openMenu]
  );

  const openContainer = useCallback((): void => {
    if (itemId === null || item?.gridSize === undefined) return;
    const panel = context === 'ground' || context === 'world' ? 'world' : 'inventory';
    navigateToContainer(itemId, panel);
  }, [itemId, item?.gridSize, context, navigateToContainer]);

  const handleMouseEnter = useCallback((): void => {
    if (itemId !== null) setSelectedItem(itemId);
  }, [itemId, setSelectedItem]);

  const handleFocus = useCallback((): void => {
    if (itemId !== null) setSelectedItem(itemId);
    onNavigate(x, y);
  }, [itemId, x, y, setSelectedItem, onNavigate]);

  return {
    cellState,
    handleClick,
    openModal,
    openContainer,
    handleMouseEnter,
    handleFocus,
  };
}
