import type { StateCreator } from 'zustand';
import type { EquipmentActionsSlice, StoreWithEquipment } from '../../types/store';
import { destroyEquippedItem } from '../../utils/destroyEquippedItem';
import { unequipItemToGrid } from '../../utils/unequipItemToGrid';
import { moveItem as ecsMoveItem } from '../../ecs/systems/moveItemSystem';
import { splitItem as ecsSplitItem } from '../../ecs/systems/splitItemSystem';
import { destroyItem as ecsDestroyItem } from '../../ecs/systems/destroyItemSystem';
import { emptyContainer as ecsEmptyContainer } from '../../ecs/systems/emptyContainerSystem';

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
    const result = ecsMoveItem({ entityId: itemId, targetGridId });
    if (!result.success) return false;
    set({ selectedItemId: null });
    return true;
  },

  splitItem: (itemId, targetGridId): boolean => {
    const result = ecsSplitItem({ entityId: itemId, targetGridId });
    if (!result.success) return false;
    set({ selectedItemId: null });
    return true;
  },

  destroyItem: (itemId): boolean => {
    // Try destroying from grid via ECS
    const gridSuccess = ecsDestroyItem({ entityId: itemId });
    if (gridSuccess) {
      set({ selectedItemId: null });
      return true;
    }
    // Fall back to equipped item destruction (not yet migrated to ECS)
    const state = get();
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
    const success = ecsEmptyContainer({ containerId });
    if (!success) return false;
    set({ selectedItemId: null });
    return true;
  },
});
