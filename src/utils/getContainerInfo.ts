/* eslint-disable local/types-in-types-directory -- Util-specific types */
import { FIRST_INDEX } from '../constants/array';
import type { UseMenuContextReturn } from '../types/inventory';

export interface ContainerInfo {
  id: string;
  name: string;
  isContainer: boolean;
  capacity: string;
}

type GetContainerInfoReturn = ContainerInfo | null;

export function getContainerInfo(
  ctx: UseMenuContextReturn,
  containerId: string
): GetContainerInfoReturn {
  const containerItem = ctx.allItems[containerId];
  if (containerItem?.gridSize === undefined) return null;

  const grid = ctx.grids[containerId];
  const usedCells = grid?.cells.flat().filter(Boolean).length ?? FIRST_INDEX;
  const totalCells = containerItem.gridSize.width * containerItem.gridSize.height;

  return {
    id: containerId,
    name: containerItem.name,
    isContainer: true,
    capacity: `${String(usedCells)}/${String(totalCells)}`,
  };
}
