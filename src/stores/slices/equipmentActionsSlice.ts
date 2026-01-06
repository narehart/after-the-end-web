import type { StateCreator } from 'zustand';
import type { EquipmentActionsSlice, StoreWithEquipment } from '../../types/store';
import { moveItem as ecsMoveItem } from '../../ecs/systems/moveItemSystem';
import { splitItem as ecsSplitItem } from '../../ecs/systems/splitItemSystem';
import { destroyItem as ecsDestroyItem } from '../../ecs/systems/destroyItemSystem';
import { emptyContainer as ecsEmptyContainer } from '../../ecs/systems/emptyContainerSystem';
import { unequipItem as ecsUnequipItem } from '../../ecs/systems/unequipItemSystem';

export const createEquipmentActionsSlice: StateCreator<
  EquipmentActionsSlice & StoreWithEquipment,
  [],
  [],
  EquipmentActionsSlice
> = (set, get) => ({
  unequipItem: (itemId, targetGridId): boolean => {
    const result = ecsUnequipItem({ entityId: itemId, targetGridId });
    if (!result.success || result.slotType === null) return false;

    const state = get();
    const shouldClearPath = state.inventoryFocusPath.includes(itemId);
    set({
      equipment: { ...state.equipment, [result.slotType]: null },
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
    // ECS destroyItem handles both grid items and equipped items
    const success = ecsDestroyItem({ entityId: itemId });
    if (!success) return false;

    const state = get();
    const shouldClearPath = state.inventoryFocusPath.includes(itemId);
    set({
      inventoryFocusPath: shouldClearPath ? [] : state.inventoryFocusPath,
      selectedItemId: null,
    });
    return true;
  },

  emptyContainer: (containerId): boolean => {
    const success = ecsEmptyContainer({ containerId });
    if (!success) return false;
    set({ selectedItemId: null });
    return true;
  },
});
