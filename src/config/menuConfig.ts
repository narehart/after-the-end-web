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

import type { MenuItem, MenuContext, MenuPathSegment } from '../types/inventory';

interface ContainerInfo {
  id: string;
  name: string;
  isContainer: boolean;
  capacity: string;
}

function getContainerInfo(ctx: MenuContext, containerId: string): ContainerInfo | null {
  const containerItem = ctx.allItems[containerId];
  if (containerItem?.gridSize === undefined) return null;

  const grid = ctx.grids[containerId];
  const usedCells = grid?.cells.flat().filter(Boolean).length ?? 0;
  const totalCells = containerItem.gridSize.width * containerItem.gridSize.height;

  return {
    id: containerId,
    name: containerItem.name,
    isContainer: true,
    capacity: `${String(usedCells)}/${String(totalCells)}`,
  };
}

function createContainerItem(
  info: ContainerInfo,
  canFit: boolean,
  newPath: string[],
  action: string
): MenuItem {
  return {
    id: info.id,
    label: info.name,
    type: 'navigate',
    hasChildren: true,
    disabled: (): boolean => !canFit,
    meta: info.capacity,
    data: { containerId: info.id, action },
    getItems: (ctx2: MenuContext): MenuItem[] => buildDestinationItems(ctx2, newPath, action),
  };
}

function buildRootDestinations(ctx: MenuContext, action: string): MenuItem[] {
  const { equipment, itemId, canFitItem, currentContainerId } = ctx;
  const items: MenuItem[] = [];

  const isOnGround = currentContainerId === 'ground';
  items.push({
    id: 'ground',
    label: isOnGround ? 'Ground (already here)' : 'Ground',
    type: 'navigate',
    hasChildren: !isOnGround,
    disabled: (): boolean => isOnGround || !canFitItem('ground'),
    data: { containerId: 'ground', action },
    getItems: (ctx2: MenuContext): MenuItem[] => buildDestinationItems(ctx2, ['ground'], action),
  });

  Object.values(equipment).forEach((equippedId) => {
    if (equippedId === null || equippedId === itemId) return;
    const info = getContainerInfo(ctx, equippedId);
    if (info !== null) {
      const isCurrentContainer = equippedId === currentContainerId;
      items.push({
        id: info.id,
        label: isCurrentContainer ? `${info.name} (already here)` : info.name,
        type: 'navigate',
        hasChildren: !isCurrentContainer,
        disabled: (): boolean => isCurrentContainer || !canFitItem(equippedId),
        meta: info.capacity,
        data: { containerId: info.id, action },
        getItems: (ctx2: MenuContext): MenuItem[] => buildDestinationItems(ctx2, [info.id], action),
      });
    }
  });

  return items;
}

function buildNestedDestinations(ctx: MenuContext, path: string[], action: string): MenuItem[] {
  const { itemId, canFitItem } = ctx;
  const currentContainerId = path[path.length - 1];
  if (currentContainerId === undefined) return [];

  const currentGrid = ctx.grids[currentContainerId];
  if (currentGrid === undefined) return [];

  const items: MenuItem[] = [];
  const seenIds = new Set<string>();

  currentGrid.cells.flat().forEach((cellItemId) => {
    if (cellItemId === null || seenIds.has(cellItemId) || cellItemId === itemId) return;
    seenIds.add(cellItemId);
    const info = getContainerInfo(ctx, cellItemId);
    if (info !== null) {
      items.push(createContainerItem(info, canFitItem(cellItemId), [...path, info.id], action));
    }
  });

  return items;
}

export function buildDestinationItems(
  ctx: MenuContext,
  path: string[] | MenuPathSegment[],
  action: string
): MenuItem[] {
  const items: MenuItem[] = [];
  const { allItems, canFitItem } = ctx;

  // Convert path to string array if needed
  const pathIds = path.map((p): string => (typeof p === 'string' ? p : p.id));

  if (pathIds.length > 0) {
    const currentContainerId = pathIds[pathIds.length - 1];
    if (currentContainerId !== undefined) {
      const canFit = canFitItem(currentContainerId);
      const isGround = currentContainerId === 'ground';
      const containerName = isGround ? 'Ground' : (allItems[currentContainerId]?.name ?? 'here');

      items.push({
        id: 'place-here',
        label: isGround ? 'Place on Ground' : `Place in ${containerName}`,
        type: 'select',
        disabled: (): boolean => !canFit,
        data: { containerId: currentContainerId, action },
      });
    }
  }

  const destinations =
    pathIds.length === 0
      ? buildRootDestinations(ctx, action)
      : buildNestedDestinations(ctx, pathIds, action);

  return [...items, ...destinations];
}

export const ITEM_ACTION_MENU: MenuItem[] = [
  {
    id: 'open',
    label: 'Open',
    icon: '▶',
    type: 'action',
    show: (ctx: MenuContext): boolean => ctx.item?.gridSize !== undefined,
  },
  {
    id: 'use',
    label: 'Use',
    icon: '○',
    type: 'action',
    show: (ctx: MenuContext): boolean => ctx.item?.type === 'consumable',
  },
  {
    id: 'equip',
    label: 'Equip',
    icon: '◆',
    type: 'action',
    show: (ctx: MenuContext): boolean => {
      const slots = ctx.item?.equippableSlots;
      return slots !== undefined && slots.length > 0 && ctx.source !== 'equipment';
    },
  },
  {
    id: 'unequip',
    label: 'Unequip to...',
    icon: '◇',
    type: 'navigate',
    hasChildren: true,
    show: (ctx: MenuContext): boolean => ctx.source === 'equipment',
    getItems: (ctx: MenuContext, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'unequip'),
  },
  {
    id: 'rotate',
    label: 'Rotate',
    icon: '↻',
    type: 'action',
    show: (ctx: MenuContext): boolean => ctx.source === 'grid',
  },
  {
    id: 'split',
    label: 'Split',
    icon: '÷',
    type: 'action',
    show: (ctx: MenuContext): boolean => {
      const item = ctx.item;
      return item?.stackable === true && item.quantity > 1;
    },
  },
  {
    id: 'move',
    label: 'Move to...',
    icon: '→',
    type: 'navigate',
    hasChildren: true,
    show: (ctx: MenuContext): boolean => ctx.source !== 'equipment',
    getItems: (ctx: MenuContext, path?: MenuPathSegment[]): MenuItem[] =>
      buildDestinationItems(ctx, path ?? [], 'move'),
  },
];
