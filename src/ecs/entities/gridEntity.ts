/**
 * Grid Entity Factory
 *
 * Creates grid entities for inventory, containers, and ground.
 * Grids have: id, grid component with dimensions and cells.
 */

import { world } from '../world';
import type { Entity, EntityId, GridId } from '../world';

interface CreateGridEntityProps {
  gridId: GridId;
  width: number;
  height: number;
}

interface CreateGridEntityReturn {
  entity: Entity;
  entityId: EntityId;
}

function createEmptyCells(width: number, height: number): Array<Array<EntityId | null>> {
  const cells: Array<Array<EntityId | null>> = [];
  for (let y = 0; y < height; y++) {
    const row: Array<EntityId | null> = [];
    for (let x = 0; x < width; x++) {
      row.push(null);
    }
    cells.push(row);
  }
  return cells;
}

export function createGridEntity(props: CreateGridEntityProps): CreateGridEntityReturn {
  const { gridId, width, height } = props;

  const entity: Entity = {
    id: gridId,
    grid: {
      gridId,
      width,
      height,
      cells: createEmptyCells(width, height),
    },
  };

  world.add(entity);

  return { entity, entityId: gridId };
}
