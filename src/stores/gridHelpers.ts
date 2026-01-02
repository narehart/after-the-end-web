import type { GridCell, GridsMap } from '../types/inventory';

type CellGrid = Array<Array<string | null>>;
interface Position {
  x: number;
  y: number;
}

export function createEmptyGrid(width: number, height: number): CellGrid {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}

export function placeItem(
  cells: CellGrid,
  itemId: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      const firstRow = cells[0];
      if (row !== undefined && firstRow !== undefined && x + dx < firstRow.length) {
        row[x + dx] = itemId;
      }
    }
  }
}

function canPlaceAt(cells: CellGrid, x: number, y: number, width: number, height: number): boolean {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      if (row === undefined) return false;
      const cell = row[x + dx];
      if (cell !== null) {
        return false;
      }
    }
  }
  return true;
}

export function findFreePosition(
  grid: GridCell,
  itemWidth: number,
  itemHeight: number
): Position | null {
  for (let y = 0; y <= grid.height - itemHeight; y++) {
    for (let x = 0; x <= grid.width - itemWidth; x++) {
      if (canPlaceAt(grid.cells, x, y, itemWidth, itemHeight)) {
        return { x, y };
      }
    }
  }
  return null;
}

export function findItemOrigin(grid: GridCell, itemId: string): Position | null {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const row = grid.cells[y];
      if (row?.[x] === itemId) {
        return { x, y };
      }
    }
  }
  return null;
}

interface ItemLocation {
  gridId: string;
  positions: Position[];
}

export function findItemInGrids(grids: GridsMap, itemId: string): ItemLocation | null {
  for (const [gridId, grid] of Object.entries(grids)) {
    if (grid === undefined) continue;
    const positions: Position[] = [];
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const row = grid.cells[y];
        if (row?.[x] === itemId) {
          positions.push({ x, y });
        }
      }
    }
    if (positions.length > 0) {
      return { gridId, positions };
    }
  }
  return null;
}

export function removeItemFromCells(cells: CellGrid, positions: Position[]): CellGrid {
  const newCells = cells.map((row) => [...row]);
  for (const pos of positions) {
    const row = newCells[pos.y];
    if (row !== undefined) {
      row[pos.x] = null;
    }
  }
  return newCells;
}

export function placeItemInCells(
  cells: CellGrid,
  itemId: string,
  x: number,
  y: number,
  width: number,
  height: number
): CellGrid {
  const newCells = cells.map((row) => [...row]);
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
