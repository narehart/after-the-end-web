/**
 * Grid Entity Factory
 *
 * Creates grid entities for inventory, containers, and ground.
 * Grids have: id, grid component with dimensions and cells.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../world';
import { createEmptyGrid } from '../../utils/createEmptyGrid';

interface CreateGridEntityProps {
  gridId: GridId;
  width: number;
  height: number;
}

interface CreateGridEntityReturn {
  entity: Entity;
  entityId: EntityId;
}

export function createGridEntity(props: CreateGridEntityProps): CreateGridEntityReturn {
  const { gridId, width, height } = props;

  const entity: Entity = {
    id: gridId,
    grid: {
      gridId,
      width,
      height,
      cells: createEmptyGrid({ width, height }),
    },
  };

  world.add(entity);

  return { entity, entityId: gridId };
}
