import type { GridsMap, ItemsMap } from '../types/inventory';
import { findItemInGrids } from './findItemInGrids';
import { removeItemFromCells } from './removeItemFromCells';

interface DestroyItemInGridProps {
  items: ItemsMap;
  grids: GridsMap;
  itemId: string;
}

interface DestroyItemInGridReturn {
  items: ItemsMap;
  grids: GridsMap;
}

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

  const { [itemId]: _removed, ...remainingItems } = items;

  return {
    items: remainingItems,
    grids: {
      ...grids,
      [location.gridId]: { ...sourceGrid, cells: newSourceCells },
    },
  };
}
