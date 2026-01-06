import { useMemo, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInventoryStore } from '../stores/inventoryStore';
import { findItemInGrids } from '../utils/findItemInGrids';
import type { UseMenuContextProps, UseMenuContextReturn, PanelType } from '../types/inventory';

export default function useMenuContext(props: UseMenuContextProps): UseMenuContextReturn {
  const { itemId, source } = props.menu;
  const item = useInventoryStore((s) => (itemId !== null ? s.items[itemId] : undefined));
  const equipment = useInventoryStore((s) => s.equipment);
  const allItems = useInventoryStore((s) => s.items);
  const grids = useInventoryStore((s) => s.grids);
  const findFreePosition = useInventoryStore((s) => s.findFreePosition);

  // Store actions - useShallow prevents infinite re-renders from object reference changes
  const actions = useInventoryStore(
    useShallow((s) => ({
      navigateToContainer: s.navigateToContainer,
      rotateItem: s.rotateItem,
      equipItem: s.equipItem,
      unequipItem: s.unequipItem,
      moveItem: s.moveItem,
      splitItem: s.splitItem,
      destroyItem: s.destroyItem,
      emptyContainer: s.emptyContainer,
      closeMenu: s.closeMenu,
    }))
  );

  const currentContainerId = useMemo((): string | null => {
    if (itemId === null) return null;
    return findItemInGrids({ grids, itemId })?.gridId ?? null;
  }, [grids, itemId]);

  const canFitItem = useCallback(
    (containerId: string): boolean => {
      if (item === undefined) return false;
      return findFreePosition(containerId, item.size.width, item.size.height) !== null;
    },
    [item, findFreePosition]
  );

  const panel: PanelType = source === 'ground' || source === 'world' ? 'world' : 'inventory';

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
      canFitItem,
      ...actions,
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
      actions,
    ]
  );
}
