import type { CellGrid, GridsMap } from '../types/inventory';

interface UpdateGridCellsProps {
  grids: GridsMap;
  gridId: string;
  cells: CellGrid;
}

type UpdateGridCellsReturn = GridsMap | null;

export function updateGridCells(props: UpdateGridCellsProps): UpdateGridCellsReturn {
  const { grids, gridId, cells } = props;
  const grid = grids[gridId];
  if (grid === undefined) return null;

  return {
    ...grids,
    [gridId]: { ...grid, cells },
  };
}
