import type { CreateContainerGridsProps, CreateContainerGridsReturn } from '../types/utils';
import { createEmptyGrid } from './createEmptyGrid';

export function createContainerGrids(props: CreateContainerGridsProps): CreateContainerGridsReturn {
  const { instances } = props;
  const grids: CreateContainerGridsReturn = {};

  for (const [id, item] of Object.entries(instances)) {
    if (item === undefined) continue;
    if (item.gridSize === undefined) continue;

    grids[id] = {
      width: item.gridSize.width,
      height: item.gridSize.height,
      cells: createEmptyGrid({
        width: item.gridSize.width,
        height: item.gridSize.height,
      }),
    };
  }

  return grids;
}
