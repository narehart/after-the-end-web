import type { CellGrid } from '../types/inventory';

export function createEmptyGrid(width: number, height: number): CellGrid {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}
