import { EMPTY_COUNT } from '../constants/inventory';
import type { GridCell } from '../types/inventory';
import { collectGridEntityIds } from './collectGridEntityIds';

export function countGridItems(grid: GridCell | undefined): number {
  if (grid === undefined) return EMPTY_COUNT;
  return collectGridEntityIds({ cells: grid.cells }).size;
}
