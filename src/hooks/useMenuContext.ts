import { useMemo, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInventoryStore } from '../stores/inventoryStore';
import type { MenuState, PanelType, UseMenuContextReturn } from '../types/inventory';
import { findFreePosition as ecsFindFreePosition } from '../ecs/queries/inventoryQueries';
import useECSInventory from './useECSInventory';

interface UseMenuContextProps {
  menu: MenuState;
}

export default function useMenuContext(props: UseMenuContextProps): UseMenuContextReturn {
  const { itemId, source } = props.menu;
  const { itemsMap: allItems, gridsMap: grids, getItem, getGrid } = useECSInventory();
  const item = itemId !== null ? allItems[itemId] : undefined;
  const equipment = useInventoryStore((s) => s.equipment);

  // Store actions - useShallow prevents infinite re-renders from object reference changes
  const actions = useInventoryStore(
    useShallow((s) => ({
      navigateToContainer: s.navigateToContainer,
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
    const entity = getItem(itemId);
    return entity?.position?.gridId ?? null;
  }, [getItem, itemId]);

  const canFitItem = useCallback(
    (containerId: string): boolean => {
      if (item === undefined) return false;
      const gridEntity = getGrid(containerId);
      if (gridEntity?.grid === undefined) return false;
      const freePos = ecsFindFreePosition({
        cells: gridEntity.grid.cells,
        gridWidth: gridEntity.grid.width,
        gridHeight: gridEntity.grid.height,
        itemWidth: item.size.width,
        itemHeight: item.size.height,
      });
      return freePos !== null;
    },
    [item, getGrid]
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
