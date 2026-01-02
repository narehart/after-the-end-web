import type { StateCreator } from 'zustand';
import type { SlotType, Equipment, ItemsMap, GridsMap, Item } from '../../types/inventory';
import {
  findFreePosition,
  findItemInGrids,
  removeItemFromCells,
  placeItemInCells,
} from '../gridHelpers';

export interface EquipmentActionsSlice {
  unequipItem: (itemId: string, targetGridId: string) => boolean;
  equipItem: (itemId: string, targetSlot?: SlotType | null) => boolean;
}

interface StoreWithEquipment {
  equipment: Equipment;
  items: ItemsMap;
  grids: GridsMap;
  inventoryFocusPath: string[];
  selectedItemId: string | null;
}

function findEquipmentSlot(equipment: Equipment, itemId: string): SlotType | null {
  for (const [slot, equippedId] of Object.entries(equipment)) {
    if (equippedId === itemId) {
      return slot as SlotType;
    }
  }
  return null;
}

function findAvailableSlot(item: Item, equipment: Equipment): SlotType | null {
  if (item.equippableSlots.length === 0) {
    return null;
  }

  for (const possibleSlot of item.equippableSlots) {
    if (equipment[possibleSlot] === null) {
      return possibleSlot;
    }
  }

  return item.equippableSlots[0] ?? null;
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

    const freePos = findFreePosition(targetGrid, item.size.width, item.size.height);
    if (freePos === null) return false;

    const shouldClearPath = state.inventoryFocusPath.includes(itemId);
    const newCells = placeItemInCells(
      targetGrid.cells,
      itemId,
      freePos.x,
      freePos.y,
      item.size.width,
      item.size.height
    );

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

    if (item.equippableSlots.length === 0) {
      return false;
    }

    const slot = targetSlot ?? findAvailableSlot(item, state.equipment);
    if (slot === null || !item.equippableSlots.includes(slot)) {
      return false;
    }

    const itemLocation = findItemInGrids(state.grids, itemId);
    if (itemLocation === null) return false;

    const { gridId, positions } = itemLocation;
    const grid = state.grids[gridId];
    if (grid === undefined) return false;

    const newCells = removeItemFromCells(grid.cells, positions);

    set({
      equipment: { ...state.equipment, [slot]: itemId },
      grids: { ...state.grids, [gridId]: { ...grid, cells: newCells } },
      selectedItemId: itemId,
    });

    return true;
  },
});
