import type { StateCreator } from 'zustand';
import type { EquipmentActionsSlice, StoreWithEquipment } from '../../types/store';
import { destroyEquippedItem } from '../../utils/destroyEquippedItem';
import { destroyItemInGrid } from '../../utils/destroyItemInGrid';
import { emptyContainerToGround } from '../../utils/emptyContainerToGround';
import { moveItemInGrid } from '../../utils/moveItemInGrid';
import { splitItemInGrid } from '../../utils/splitItemInGrid';
import { unequipItemToGrid } from '../../utils/unequipItemToGrid';

export const createEquipmentActionsSlice: StateCreator<
  EquipmentActionsSlice & StoreWithEquipment,
  [],
  [],
  EquipmentActionsSlice
> = (set, get) => ({
  unequipItem: (itemId, targetGridId): boolean => {
    const state = get();
    const result = unequipItemToGrid({
      items: state.items,
      grids: state.grids,
      equipment: state.equipment,
      itemId,
      targetGridId,
    });
    if (result === null) return false;
    const shouldClearPath = state.inventoryFocusPath.includes(itemId);
    set({
      equipment: result.equipment,
      grids: result.grids,
      inventoryFocusPath: shouldClearPath ? [] : state.inventoryFocusPath,
      selectedItemId: null,
    });
    return true;
  },

  // TODO: Re-enable when equippable slots data is added to neoItems.json
  equipItem: (): boolean => {
    return false;
  },

  moveItem: (itemId, targetGridId): boolean => {
    const state = get();
    const result = moveItemInGrid({
      items: state.items,
      grids: state.grids,
      itemId,
      targetGridId,
    });
    if (result === null) return false;

    set({
      items: result.items,
      grids: result.grids,
      selectedItemId: null,
    });

    return true;
  },

  splitItem: (itemId, targetGridId): boolean => {
    const state = get();
    const result = splitItemInGrid({
      items: state.items,
      grids: state.grids,
      itemId,
      targetGridId,
    });
    if (result === null) return false;

    set({
      items: result.items,
      grids: result.grids,
      selectedItemId: null,
    });

    return true;
  },

  destroyItem: (itemId): boolean => {
    const state = get();
    const gridResult = destroyItemInGrid({ items: state.items, grids: state.grids, itemId });
    if (gridResult !== null) {
      set({ items: gridResult.items, grids: gridResult.grids, selectedItemId: null });
      return true;
    }
    const equipResult = destroyEquippedItem({
      items: state.items,
      equipment: state.equipment,
      itemId,
    });
    if (equipResult !== null) {
      const shouldClearPath = state.inventoryFocusPath.includes(itemId);
      set({
        items: equipResult.items,
        equipment: equipResult.equipment,
        inventoryFocusPath: shouldClearPath ? [] : state.inventoryFocusPath,
        selectedItemId: null,
      });
      return true;
    }
    return false;
  },

  emptyContainer: (containerId): boolean => {
    const state = get();
    const result = emptyContainerToGround({
      items: state.items,
      grids: state.grids,
      containerId,
    });
    if (result === null) return false;

    set({
      items: result.items,
      grids: result.grids,
      selectedItemId: null,
    });

    return true;
  },
});
