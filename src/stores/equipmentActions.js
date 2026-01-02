import {
  findFreePosition,
  findItemInGrids,
  removeItemFromCells,
  placeItemInCells,
} from './gridHelpers';

// Find which equipment slot contains an item
function findEquipmentSlot(equipment, itemId) {
  for (const [slot, equippedId] of Object.entries(equipment)) {
    if (equippedId === itemId) {
      return slot;
    }
  }
  return null;
}

// Find the best available slot for an item
function findAvailableSlot(item, equipment) {
  if (!item.equippableSlots || item.equippableSlots.length === 0) {
    return null;
  }

  // Find first empty slot from equippable slots
  for (const possibleSlot of item.equippableSlots) {
    if (equipment[possibleSlot] === null) {
      return possibleSlot;
    }
  }

  // Fall back to first equippable slot (will replace existing)
  return item.equippableSlots[0];
}

// Unequip an item from equipment to a container/ground
export function createUnequipAction(get) {
  return (itemId, targetGridId) => {
    const { equipment, items, grids, inventoryFocusPath } = get();
    const item = items[itemId];
    if (!item) return false;

    const equipmentSlot = findEquipmentSlot(equipment, itemId);
    if (!equipmentSlot) return false;

    const targetGrid = grids[targetGridId];
    if (!targetGrid) return false;

    const freePos = findFreePosition(targetGrid, item.size.width, item.size.height);
    if (!freePos) return false;

    const shouldClearPath = inventoryFocusPath.includes(itemId);
    const newCells = placeItemInCells(
      targetGrid.cells,
      itemId,
      freePos.x,
      freePos.y,
      item.size.width,
      item.size.height
    );

    return {
      equipment: { ...equipment, [equipmentSlot]: null },
      grids: { ...grids, [targetGridId]: { ...targetGrid, cells: newCells } },
      inventoryFocusPath: shouldClearPath ? [] : inventoryFocusPath,
      selectedItemId: null,
    };
  };
}

// Equip an item from a grid to an equipment slot
export function createEquipAction(get) {
  return (itemId, targetSlot = null) => {
    const { equipment, items, grids } = get();
    const item = items[itemId];
    if (!item) return null;

    if (!item.equippableSlots || item.equippableSlots.length === 0) {
      return null;
    }

    const slot = targetSlot || findAvailableSlot(item, equipment);
    if (!slot || !item.equippableSlots.includes(slot)) {
      return null;
    }

    const itemLocation = findItemInGrids(grids, itemId);
    if (!itemLocation) return null;

    const { gridId, positions } = itemLocation;
    const newCells = removeItemFromCells(grids[gridId].cells, positions);

    return {
      equipment: { ...equipment, [slot]: itemId },
      grids: { ...grids, [gridId]: { ...grids[gridId], cells: newCells } },
      selectedItemId: itemId,
    };
  };
}
