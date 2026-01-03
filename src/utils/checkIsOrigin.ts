import type { CheckIsOriginProps } from '../types/utils';
import { findItemOrigin } from './findItemOrigin';

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
