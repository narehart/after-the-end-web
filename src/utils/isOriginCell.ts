/**
 * Is Origin Cell
 *
 * Checks if a cell is the top-left origin of a multi-cell item.
 */

import { FIRST_INDEX, SECOND_INDEX } from '../constants/primitives';

interface IsOriginCellProps {
  cells: Array<Array<string | null>>;
  x: number;
  y: number;
  itemId: string;
}

export function isOriginCell(props: IsOriginCellProps): boolean {
  const { cells, x, y, itemId } = props;
  const row = cells[y];
  if (row === undefined) return false;

  const isLeftEdge = x === FIRST_INDEX || row[x - SECOND_INDEX] !== itemId;
  const rowAbove = cells[y - SECOND_INDEX];
  const cellAbove = rowAbove?.[x];
  const isTopEdge = y === FIRST_INDEX || cellAbove !== itemId;

  return isLeftEdge && isTopEdge;
}
