import type { GridsMap, ItemsMap } from '../types/inventory';
import { populateContainer } from './populateContainer';

interface PopulateEquippedContainerProps {
  instanceId: string | null;
  grids: GridsMap;
  allInstances: ItemsMap;
}

interface PopulateEquippedContainerReturn {
  grids: GridsMap;
  instances: ItemsMap;
}

export function populateEquippedContainer(
  props: PopulateEquippedContainerProps
): PopulateEquippedContainerReturn {
  const { instanceId, grids, allInstances } = props;

  if (instanceId === null) {
    return { grids, instances: allInstances };
  }

  const existingGrid = grids[instanceId];
  if (existingGrid === undefined) {
    return { grids, instances: allInstances };
  }

  const contents = populateContainer({ width: existingGrid.width, height: existingGrid.height });

  return {
    grids: {
      ...grids,
      [instanceId]: contents.grid,
      ...contents.containerGrids,
    },
    instances: {
      ...allInstances,
      ...contents.instances,
    },
  };
}
