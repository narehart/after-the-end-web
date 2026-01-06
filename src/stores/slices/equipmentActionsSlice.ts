import type { StateCreator } from 'zustand';
import type { SlotType, Equipment } from '../../types/inventory';
import type { EquipmentActionsSlice, StoreWithEquipment } from '../../types/store';
import { destroyItemInGrid } from '../../utils/destroyItemInGrid';
import { findFreePosition } from '../../utils/findFreePosition';
import { moveItemInGrid } from '../../utils/moveItemInGrid';
import { placeItemInCells } from '../../utils/placeItemInCells';
import { splitItemInGrid } from '../../utils/splitItemInGrid';

function isSlotType(key: string, equipment: Equipment): key is SlotType {
  return key in equipment;
}

function findEquipmentSlot(equipment: Equipment, itemId: string): SlotType | null {
  for (const slot of Object.keys(equipment)) {
    if (isSlotType(slot, equipment) && equipment[slot] === itemId) {
      return slot;
    }
  }
  return null;
}

export const createEquipmentActionsSlice: StateCreator<
  EquipmentActionsSlice & StoreWithEquipment,
  [],
  [],
  EquipmentActionsSlice
> = (set, get) => ({
  unequipItem: (itemId, targetGridId): boolean => {
    const state = get();
    const item = state.items[itemId];
    if (item === undefined) return false;

    const equipmentSlot = findEquipmentSlot(state.equipment, itemId);
    if (equipmentSlot === null) return false;

    const targetGrid = state.grids[targetGridId];
    if (targetGrid === undefined) return false;

    const freePos = findFreePosition({
      grid: targetGrid,
      itemWidth: item.size.width,
      itemHeight: item.size.height,
    });
    if (freePos === null) return false;

    const shouldClearPath = state.inventoryFocusPath.includes(itemId);
    const newCells = placeItemInCells({
      grid: targetGrid.cells,
      itemId,
      x: freePos.x,
      y: freePos.y,
      width: item.size.width,
      height: item.size.height,
    });

    set({
      equipment: { ...state.equipment, [equipmentSlot]: null },
      grids: { ...state.grids, [targetGridId]: { ...targetGrid, cells: newCells } },
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
    const result = destroyItemInGrid({
      items: state.items,
      grids: state.grids,
      itemId,
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
