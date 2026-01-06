import { SECOND_INDEX } from '../constants/array';
import type { MenuItem, UseMenuContextReturn } from '../types/inventory';
import { getContainerInfo } from './getContainerInfo';
import { createContainerItem } from './createContainerItem';

;

interface BuildNestedDestinationsProps {
  ctx: UseMenuContextReturn;
  path: string[];
  action: string;
}

type BuildNestedDestinationsReturn = MenuItem[];

export function buildNestedDestinations(
  props: BuildNestedDestinationsProps
): BuildNestedDestinationsReturn {
  const { ctx, path, action } = props;
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
      items.push(
        createContainerItem({
          info,
          canFit: canFitItem(cellItemId),
          newPath: [...path, info.id],
          action,
        })
      );
    }
  });

  return items;
}
