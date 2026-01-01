// Navigate into a container - returns new state if successful
export function createNavigateToContainer(get) {
  return (containerId, panel, fromEquipment = false) => {
    const { inventoryFocusPath, worldFocusPath, items } = get();
    const item = items[containerId];
    if (!item?.gridSize) return null;

    const focusPath = panel === 'inventory' ? inventoryFocusPath : worldFocusPath;
    const pathKey = panel === 'inventory' ? 'inventoryFocusPath' : 'worldFocusPath';

    if (focusPath[focusPath.length - 1] === containerId) return null;

    if (fromEquipment || panel === 'world') {
      return { [pathKey]: [containerId], selectedItemId: containerId };
    }
    return { [pathKey]: [...focusPath, containerId], selectedItemId: containerId };
  };
}

// Navigate back in breadcrumb - returns new state if successful
export function createNavigateBack(get) {
  return (index, panel) => {
    const { inventoryFocusPath, worldFocusPath } = get();
    const focusPath = panel === 'inventory' ? inventoryFocusPath : worldFocusPath;
    const pathKey = panel === 'inventory' ? 'inventoryFocusPath' : 'worldFocusPath';

    if (index >= focusPath.length - 1) return null;

    const newPath = focusPath.slice(0, index + 1);
    return { [pathKey]: newPath, selectedItemId: newPath[newPath.length - 1] };
  };
}

// Focus on equipment slot - returns new state
export function createFocusOnEquipmentSlot(get) {
  return (slotType) => {
    const { equipment, items } = get();
    const itemId = equipment[slotType];
    if (!itemId) return null;

    const item = items[itemId];
    if (item?.gridSize) {
      return { inventoryFocusPath: [itemId], selectedItemId: itemId };
    }
    return { selectedItemId: itemId };
  };
}
