/**
 * Grid Component
 *
 * Grid structure (inventory grid, container grid)
 * Uses 2D array matching existing CellGrid type
 */

import type { GridId } from '../world';
import type { CellGrid } from '../../types/inventory';

export interface GridComponent {
  gridId: GridId;
  width: number;
  height: number;
  cells: CellGrid;
}
