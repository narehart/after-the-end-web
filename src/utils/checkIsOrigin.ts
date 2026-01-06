import type { GridCell } from '../types/inventory';
import { findItemOrigin } from './findItemOrigin';

interface CheckIsOriginProps {
  grid: GridCell;
  itemId: string | null;
  col: number;
  row: number;
  renderedItems: Set<string>;
}

export function checkIsOrigin(props: CheckIsOriginProps): boolean {
  const { grid, itemId, col, row, renderedItems } = props;
  if (itemId === null || renderedItems.has(itemId)) return false;
  const origin = findItemOrigin({ grid, itemId });
  if (origin !== null && origin.x === col && origin.y === row) {
    renderedItems.add(itemId);
    return true;
  }
  return false;
}
