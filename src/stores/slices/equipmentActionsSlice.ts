import type { StateCreator } from 'zustand';
import type { SlotType, Equipment } from '../../types/inventory';
import type { EquipmentActionsSlice, StoreWithEquipment } from '../../types/store';
import { findFreePosition } from '../../utils/findFreePosition';
import { findItemInGrids } from '../../utils/findItemInGrids';
import { placeItemInCells } from '../../utils/placeItemInCells';
import { removeItemFromCells } from '../../utils/removeItemFromCells';

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
    const item = state.items[itemId];
    if (item === undefined) return false;

    // Find where the item currently is
    const location = findItemInGrids({ grids: state.grids, itemId });
    if (location === null) return false;

    // Don't move to the same grid
    if (location.gridId === targetGridId) return false;

    const sourceGrid = state.grids[location.gridId];
    const targetGrid = state.grids[targetGridId];
    if (sourceGrid === undefined || targetGrid === undefined) return false;

    // Find a free position in the target grid
    const freePos = findFreePosition({
      grid: targetGrid,
      itemWidth: item.size.width,
      itemHeight: item.size.height,
    });
    if (freePos === null) return false;

    // Remove from source grid
    const newSourceCells = removeItemFromCells({
      cells: sourceGrid.cells,
      positions: location.positions,
    });

    // Place in target grid
    const newTargetCells = placeItemInCells({
      grid: targetGrid.cells,
      itemId,
      x: freePos.x,
      y: freePos.y,
      width: item.size.width,
      height: item.size.height,
    });

    set({
      grids: {
        ...state.grids,
        [location.gridId]: { ...sourceGrid, cells: newSourceCells },
        [targetGridId]: { ...targetGrid, cells: newTargetCells },
      },
      selectedItemId: null,
    });

    return true;
  },
});
