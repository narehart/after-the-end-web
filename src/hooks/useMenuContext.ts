import { useMemo, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { findItemInGrids } from '../utils/findItemInGrids';
import type { UseMenuContextProps, UseMenuContextReturn, PanelType } from '../types/inventory';

export default function useMenuContext(props: UseMenuContextProps): UseMenuContextReturn {
  const { menu } = props;
  const { itemId, source } = menu;
  const item = useInventoryStore((state) => (itemId !== null ? state.items[itemId] : undefined));
  const equipment = useInventoryStore((state) => state.equipment);
  const allItems = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);

  // Store actions
  const navigateToContainer = useInventoryStore((state) => state.navigateToContainer);
  const rotateItem = useInventoryStore((state) => state.rotateItem);
  const equipItem = useInventoryStore((state) => state.equipItem);
  const unequipItem = useInventoryStore((state) => state.unequipItem);
  const moveItem = useInventoryStore((state) => state.moveItem);
  const splitItem = useInventoryStore((state) => state.splitItem);
  const findFreePosition = useInventoryStore((state) => state.findFreePosition);
  const closeMenu = useInventoryStore((state) => state.closeMenu);

  // Find which container the item is currently in
  const currentContainerId = useMemo((): string | null => {
    if (itemId === null) return null;
    const location = findItemInGrids({ grids, itemId });
    return location?.gridId ?? null;
  }, [grids, itemId]);

  const canFitItem = useCallback(
    (containerId: string): boolean => {
      if (item === undefined) return false;
      return findFreePosition(containerId, item.size.width, item.size.height) !== null;
    },
    [item, findFreePosition]
  );

  const isInWorld = source === 'ground' || source === 'world';
  const panel: PanelType = isInWorld ? 'world' : 'inventory';

  return useMemo(
    (): UseMenuContextReturn => ({
      item,
      itemId,
      source,
      panel,
      equipment,
      allItems,
      grids,
      currentContainerId,

      // Query functions
      canFitItem,

      // Actions
      navigateToContainer,
      rotateItem,
      equipItem,
      unequipItem,
      moveItem,
      splitItem,
      closeMenu,
    }),
    [
      item,
      itemId,
      source,
      panel,
      equipment,
      allItems,
      grids,
      currentContainerId,
      canFitItem,
      navigateToContainer,
      rotateItem,
      equipItem,
      unequipItem,
      moveItem,
      splitItem,
      closeMenu,
    ]
  );
}
