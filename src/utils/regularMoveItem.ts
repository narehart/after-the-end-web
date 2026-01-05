import type { GridsMap, Item, ItemsMap } from '../types/inventory';
import { findFreePosition } from './findFreePosition';
import { placeItemInCells } from './placeItemInCells';
import { removeItemFromCells } from './removeItemFromCells';

interface RegularMoveItemProps {
  items: ItemsMap;
  grids: GridsMap;
  item: Item;
  itemId: string;
  targetGridId: string;
  location: { gridId: string; positions: Array<{ x: number; y: number }> };
  sourceGrid: { cells: Array<Array<string | null>>; width: number; height: number };
  targetGrid: { cells: Array<Array<string | null>>; width: number; height: number };
}

interface RegularMoveItemReturn {
  items: ItemsMap;
  grids: GridsMap;
}

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
