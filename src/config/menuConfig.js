/**
 * Menu Configuration
 *
 * Defines the structure of item action menus using a declarative config.
 * Each menu item has:
 *   - id: unique identifier
 *   - label: display text (can be function for dynamic labels)
 *   - icon: optional icon character
 *   - type: 'action' | 'navigate' | 'select'
 *   - show: (ctx) => boolean - hide item if returns false
 *   - disabled: (ctx) => boolean - disable item if returns true
 *   - onAction: (ctx) => void - for 'action' type
 *   - getItems: (ctx, path) => MenuConfig[] - for 'navigate' type
 *   - hasChildren: boolean - shows arrow indicator
 */

function getContainerInfo(items, grids, containerId) {
  const containerItem = items[containerId];
  if (!containerItem?.gridSize) return null;

  const grid = grids[containerId];
  const usedCells = grid?.cells.flat().filter(Boolean).length || 0;
  const totalCells = containerItem.gridSize.width * containerItem.gridSize.height;

  return {
    id: containerId,
    name: containerItem.name,
    isContainer: true,
    capacity: `${usedCells}/${totalCells}`,
  };
}

function createContainerItem(info, canFit, newPath, action) {
  return {
    id: info.id,
    label: info.name,
    type: 'navigate',
    hasChildren: true,
    disabled: () => !canFit,
    meta: info.capacity,
    data: { containerId: info.id, action },
    getItems: (ctx2) => buildDestinationItems(ctx2, newPath, action),
  };
}

function buildRootDestinations(ctx, action) {
  const { equipment, allItems, grids, itemId, canFitItem } = ctx;
  const items = [];

  items.push({
    id: 'ground',
    label: 'Ground',
    type: 'navigate',
    hasChildren: true,
    disabled: () => !canFitItem('ground'),
    data: { containerId: 'ground', action },
    getItems: (ctx2) => buildDestinationItems(ctx2, ['ground'], action),
  });

  Object.values(equipment).forEach((equippedId) => {
    if (!equippedId || equippedId === itemId) return;
    const info = getContainerInfo(allItems, grids, equippedId);
    if (info) {
      items.push(createContainerItem(info, canFitItem(equippedId), [info.id], action));
    }
  });

  return items;
}

function buildNestedDestinations(ctx, path, action) {
  const { allItems, grids, itemId, canFitItem } = ctx;
  const currentContainerId = path[path.length - 1];
  const currentGrid = grids[currentContainerId];
  if (!currentGrid) return [];

  const items = [];
  const seenIds = new Set();

  currentGrid.cells.flat().forEach((cellItemId) => {
    if (!cellItemId || seenIds.has(cellItemId) || cellItemId === itemId) return;
    seenIds.add(cellItemId);
    const info = getContainerInfo(allItems, grids, cellItemId);
    if (info) {
      items.push(createContainerItem(info, canFitItem(cellItemId), [...path, info.id], action));
    }
  });

  return items;
}

export function buildDestinationItems(ctx, path, action) {
  const items = [];
  const { allItems, canFitItem } = ctx;

  if (path.length > 0) {
    const currentContainerId = path[path.length - 1];
    const canFit = canFitItem(currentContainerId);
    const containerName = currentContainerId === 'ground'
      ? 'Ground'
      : (allItems[currentContainerId]?.name || 'here');

    items.push({
      id: 'place-here',
      label: `Place in ${containerName}`,
      type: 'select',
      disabled: () => !canFit,
      data: { containerId: currentContainerId, action },
    });
  }

  const destinations = path.length === 0
    ? buildRootDestinations(ctx, action)
    : buildNestedDestinations(ctx, path, action);

  return [...items, ...destinations];
}

export const ITEM_ACTION_MENU = [
  {
    id: 'open',
    label: 'Open',
    icon: '▶',
    type: 'action',
    show: (ctx) => ctx.item?.gridSize != null,
  },
  {
    id: 'use',
    label: 'Use',
    icon: '○',
    type: 'action',
    show: (ctx) => ctx.item?.type === 'consumable',
  },
  {
    id: 'equip',
    label: 'Equip',
    icon: '◆',
    type: 'action',
    show: (ctx) => ctx.item?.equippableSlots?.length > 0 && ctx.source !== 'equipment',
  },
  {
    id: 'unequip',
    label: 'Unequip to...',
    icon: '◇',
    type: 'navigate',
    hasChildren: true,
    show: (ctx) => ctx.source === 'equipment',
    getItems: (ctx, path) => buildDestinationItems(ctx, path, 'unequip'),
  },
  {
    id: 'rotate',
    label: 'Rotate',
    icon: '↻',
    type: 'action',
    show: (ctx) => ctx.source === 'grid',
  },
  {
    id: 'split',
    label: 'Split',
    icon: '÷',
    type: 'action',
    show: (ctx) => ctx.item?.stackable && ctx.item?.quantity > 1,
  },
  {
    id: 'move',
    label: 'Move to...',
    icon: '→',
    type: 'navigate',
    hasChildren: true,
    show: (ctx) => ctx.source !== 'equipment',
    getItems: (ctx, path) => buildDestinationItems(ctx, path, 'move'),
  },
];
