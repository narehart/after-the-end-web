import type { GridsMap } from '../types/inventory';
import type { PopulateContainerProps, PopulateContainerReturn } from '../types/randomContainer';
import { buildGridWithItems } from './buildGridWithItems';
import { createContainerGrids } from './createContainerGrids';
import { getRandomContainerContents } from './getRandomContainerContents';

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
