/**
 * Position Component
 *
 * Position within a grid (inventory, container, etc.)
 */

import type { GridId } from '../world';

export interface PositionComponent {
  gridId: GridId;
  x: number;
  y: number;
}
