import type { GridCell } from '../types/inventory';
import { findItemOrigin } from './findItemOrigin';

export function checkIsOrigin(
  grid: GridCell,
  itemId: string | null,
  col: number,
  row: number,
  renderedItems: Set<string>
): boolean {
  if (itemId === null || renderedItems.has(itemId)) return false;
  const origin = findItemOrigin(grid, itemId);
  if (origin !== null && origin.x === col && origin.y === row) {
    renderedItems.add(itemId);
    return true;
  }
  return false;
}
