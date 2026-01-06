import type { Item } from '../types/inventory';
import type { GridOperationBaseProps, GridOperationBaseReturn } from '../types/utils';
import { findFreePosition } from './findFreePosition';
import { placeItemInCells } from './placeItemInCells';
import { removeItemFromCells } from './removeItemFromCells';

interface RegularMoveItemProps extends GridOperationBaseProps {
  item: Item;
  targetGridId: string;
  location: { gridId: string; positions: Array<{ x: number; y: number }> };
  sourceGrid: { cells: Array<Array<string | null>>; width: number; height: number };
  targetGrid: { cells: Array<Array<string | null>>; width: number; height: number };
}

type RegularMoveItemReturn = GridOperationBaseReturn;

export function regularMoveItem(props: RegularMoveItemProps): RegularMoveItemReturn | null {
  const { items, grids, item, itemId, targetGridId, location, sourceGrid, targetGrid } = props;

  const freePos = findFreePosition({
    grid: targetGrid,
    itemWidth: item.size.width,
    itemHeight: item.size.height,
  });
  if (freePos === null) return null;

  const newSourceCells = removeItemFromCells({
    cells: sourceGrid.cells,
    positions: location.positions,
  });
  const newTargetCells = placeItemInCells({
    grid: targetGrid.cells,
    itemId,
    x: freePos.x,
    y: freePos.y,
    width: item.size.width,
    height: item.size.height,
  });

  return {
    items,
    grids: {
      ...grids,
      [location.gridId]: { ...sourceGrid, cells: newSourceCells },
      [targetGridId]: { ...targetGrid, cells: newTargetCells },
    },
  };
}
