import type { GridOperationBaseProps, GridOperationBaseReturn } from '../types/utils';
import { findItemInGrids } from './findItemInGrids';
import { removeItemFromCells } from './removeItemFromCells';
import { removeItemFromMap } from './removeItemFromMap';
import { updateGridCells } from './updateGridCells';

type DestroyItemInGridProps = GridOperationBaseProps;

type DestroyItemInGridReturn = GridOperationBaseReturn;

export function destroyItemInGrid(props: DestroyItemInGridProps): DestroyItemInGridReturn | null {
  const { items, grids, itemId } = props;

  const location = findItemInGrids({ grids, itemId });
  if (location === null) return null;

  const sourceGrid = grids[location.gridId];
  if (sourceGrid === undefined) return null;

  const newSourceCells = removeItemFromCells({
    cells: sourceGrid.cells,
    positions: location.positions,
  });

  const updatedGrids = updateGridCells({ grids, gridId: location.gridId, cells: newSourceCells });
  if (updatedGrids === null) return null;

  return {
    items: removeItemFromMap({ items, itemId }),
    grids: updatedGrids,
  };
}
