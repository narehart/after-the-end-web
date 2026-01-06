/**
 * Position Component
 *
 * Position within a grid (inventory, container, etc.)
 */

import type { GridId } from '../../types/ecs';

export interface PositionComponent {
  gridId: GridId;
  x: number;
  y: number;
}
