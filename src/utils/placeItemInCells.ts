import type { PlaceItemInCellsProps, PlaceItemInCellsReturn } from '../types/utils';

export function placeItemInCells(props: PlaceItemInCellsProps): PlaceItemInCellsReturn {
  const { grid, itemId, x, y, width, height } = props;
  const newCells = grid.map((row) => [...row]);
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = newCells[y + dy];
      if (row !== undefined) {
        row[x + dx] = itemId;
      }
    }
  }
  return newCells;
}
