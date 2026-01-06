/**
 * Grid Component
 *
 * Grid structure (inventory grid, container grid)
 * Uses 2D array matching existing CellGrid type
 */

import type { EntityId, GridId } from '../../types/ecs';

export interface GridComponent {
  gridId: GridId;
  width: number;
  height: number;
  cells: Array<Array<EntityId | null>>;
}
