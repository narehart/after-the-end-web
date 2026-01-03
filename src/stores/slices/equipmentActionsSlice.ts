import type { StateCreator } from 'zustand';
import { FIRST_INDEX } from '../../constants/numbers';
import type { SlotType, Equipment, Item } from '../../types/inventory';
import type { EquipmentActionsSlice, StoreWithEquipment } from '../../types/store';
import { findFreePosition } from '../../utils/findFreePosition';
import { findItemInGrids } from '../../utils/findItemInGrids';
import { removeItemFromCells } from '../../utils/removeItemFromCells';
import { placeItemInCells } from '../../utils/placeItemInCells';

export type { EquipmentActionsSlice } from '../../types/store';

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

function findAvailableSlot(item: Item, equipment: Equipment): SlotType | null {
  if (item.equippableSlots.length === FIRST_INDEX) {
    return null;
  }

  for (const possibleSlot of item.equippableSlots) {
    if (equipment[possibleSlot] === null) {
      return possibleSlot;
    }
  }

  return item.equippableSlots[FIRST_INDEX] ?? null;
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

  equipItem: (itemId, targetSlot = null): boolean => {
    const state = get();
    const item = state.items[itemId];
    if (item === undefined) return false;

    if (item.equippableSlots.length === FIRST_INDEX) {
      return false;
    }

    const slot = targetSlot ?? findAvailableSlot(item, state.equipment);
    if (slot === null || !item.equippableSlots.includes(slot)) {
      return false;
    }

    const itemLocation = findItemInGrids({ grids: state.grids, itemId });
    if (itemLocation === null) return false;

    const { gridId, positions } = itemLocation;
    const grid = state.grids[gridId];
    if (grid === undefined) return false;

    const newCells = removeItemFromCells({ cells: grid.cells, positions });

    set({
      equipment: { ...state.equipment, [slot]: itemId },
      grids: { ...state.grids, [gridId]: { ...grid, cells: newCells } },
      selectedItemId: itemId,
    });

    return true;
  },
});
