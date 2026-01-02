import { useMemo, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { findItemInGrids } from '../stores/gridHelpers';

export default function useMenuContext(menu) {
  const { itemId, source } = menu;
  const item = useInventoryStore((state) => state.items[itemId]);
  const equipment = useInventoryStore((state) => state.equipment);
  const allItems = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);

  // Store actions
  const navigateToContainer = useInventoryStore((state) => state.navigateToContainer);
  const rotateItem = useInventoryStore((state) => state.rotateItem);
  const equipItem = useInventoryStore((state) => state.equipItem);
  const unequipItem = useInventoryStore((state) => state.unequipItem);
  const findFreePosition = useInventoryStore((state) => state.findFreePosition);
  const closeMenu = useInventoryStore((state) => state.closeMenu);

  // Find which container the item is currently in
  const currentContainerId = useMemo(() => {
    const location = findItemInGrids(grids, itemId);
    return location?.gridId || null;
  }, [grids, itemId]);

  const canFitItem = useCallback((containerId) => {
    if (!item) return false;
    return findFreePosition(containerId, item.size.width, item.size.height) !== null;
  }, [item, findFreePosition]);

  const isInWorld = source === 'ground' || source === 'world';
  const panel = isInWorld ? 'world' : 'inventory';

  return useMemo(() => ({
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
    closeMenu,
  }), [
    item, itemId, source, panel, equipment, allItems, grids, currentContainerId,
    canFitItem, navigateToContainer, rotateItem, equipItem, unequipItem, closeMenu,
  ]);
}
