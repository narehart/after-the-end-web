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

import { FIRST_INDEX, SECOND_INDEX } from '../constants/numbers';
import type { MenuItem, UseMenuContextReturn, MenuPathSegment } from '../types/inventory';
import type { ContainerInfo } from '../types/ui';

function getContainerInfo(ctx: UseMenuContextReturn, containerId: string): ContainerInfo | null {
  const containerItem = ctx.allItems[containerId];
  if (containerItem?.gridSize === undefined) return null;

  const grid = ctx.grids[containerId];
  const usedCells = grid?.cells.flat().filter(Boolean).length ?? FIRST_INDEX;
  const totalCells = containerItem.gridSize.width * containerItem.gridSize.height;

  return {
    id: containerId,
    name: containerItem.description,
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
    getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
      buildDestinationItems(ctx2, newPath, action),
  };
}

function buildRootDestinations(ctx: UseMenuContextReturn, action: string): MenuItem[] {
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
    getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
      buildDestinationItems(ctx2, ['ground'], action),
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
        getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
          buildDestinationItems(ctx2, [info.id], action),
      });
    }
  });

  return items;
}

function buildNestedDestinations(
  ctx: UseMenuContextReturn,
  path: string[],
  action: string
): MenuItem[] {
  const { itemId, canFitItem } = ctx;
  const currentContainerId = path[path.length - SECOND_INDEX];
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
  ctx: UseMenuContextReturn,
  path: string[] | MenuPathSegment[],
  action: string
): MenuItem[] {
  const items: MenuItem[] = [];
  const { allItems, canFitItem } = ctx;

  // Convert path to string array if needed
  const pathIds = path.map((p): string => (typeof p === 'string' ? p : p.id));

  if (pathIds.length > FIRST_INDEX) {
    const currentContainerId = pathIds[pathIds.length - SECOND_INDEX];
    if (currentContainerId !== undefined) {
      const canFit = canFitItem(currentContainerId);
      const isGround = currentContainerId === 'ground';
      const containerName = isGround
        ? 'Ground'
        : (allItems[currentContainerId]?.description ?? 'here');

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
    pathIds.length === FIRST_INDEX
      ? buildRootDestinations(ctx, action)
      : buildNestedDestinations(ctx, pathIds, action);

  return [...items, ...destinations];
}
