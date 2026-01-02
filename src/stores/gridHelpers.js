// Helper to create empty grid
export function createEmptyGrid(width, height) {
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill(null));
}

// Helper to place item in grid
export function placeItem(cells, itemId, x, y, width, height) {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      if (y + dy < cells.length && x + dx < cells[0].length) {
        cells[y + dy][x + dx] = itemId;
      }
    }
  }
}

// Find a free position in a grid that can fit an item
export function findFreePosition(grid, itemWidth, itemHeight) {
  if (!grid) return null;

  for (let y = 0; y <= grid.height - itemHeight; y++) {
    for (let x = 0; x <= grid.width - itemWidth; x++) {
      if (canPlaceAt(grid.cells, x, y, itemWidth, itemHeight)) {
        return { x, y };
      }
    }
  }
  return null;
}

// Check if an item can be placed at a position
function canPlaceAt(cells, x, y, width, height) {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      if (cells[y + dy][x + dx] !== null) {
        return false;
      }
    }
  }
  return true;
}

// Find the origin position of an item in a grid
export function findItemOrigin(grid, itemId) {
  if (!grid) return null;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.cells[y][x] === itemId) {
        return { x, y };
      }
    }
  }
  return null;
}

// Find which grid contains an item and all its positions
export function findItemInGrids(grids, itemId) {
  for (const [gridId, grid] of Object.entries(grids)) {
    const positions = [];
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (grid.cells[y][x] === itemId) {
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

// Remove an item from grid cells
export function removeItemFromCells(cells, positions) {
  const newCells = cells.map((row) => [...row]);
  for (const pos of positions) {
    newCells[pos.y][pos.x] = null;
  }
  return newCells;
}

// Place an item in grid cells
export function placeItemInCells(cells, itemId, x, y, width, height) {
  const newCells = cells.map((row) => [...row]);
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      newCells[y + dy][x + dx] = itemId;
    }
  }
  return newCells;
}
