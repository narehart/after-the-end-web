import type { CellGrid, GridsMap, ItemsMap } from '../types/inventory';
import { buildGridWithItems } from './buildGridWithItems';
import { createContainerGrids } from './createContainerGrids';
import { getRandomContainerContents } from './getRandomContainerContents';

interface PopulateContainerProps {
  width: number;
  height: number;
}

interface PopulateContainerReturn {
  grid: {
    width: number;
    height: number;
    cells: CellGrid;
  };
  instances: ItemsMap;
  containerGrids: GridsMap;
}

export function populateContainer(props: PopulateContainerProps): PopulateContainerReturn {
  const { width, height } = props;
  const result = buildGridWithItems({
    width,
    height,
    items: getRandomContainerContents({ width, height }),
  });

  const grids: GridsMap = {
    ...createContainerGrids({ instances: result.instances }),
  };

  return {
    grid: { width, height, cells: result.cells },
    instances: result.instances,
    containerGrids: grids,
  };
}
