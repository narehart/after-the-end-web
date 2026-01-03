import type { GridsMap } from '../types/inventory';
import { createEmptyGrid } from '../utils/createEmptyGrid';
import { placeItem } from '../utils/placeItem';

function createBackpackGrid(): Array<Array<string | null>> {
  const cells = createEmptyGrid(10, 10);
  placeItem(cells, 'medkit-1', 0, 0, 3, 3);
  placeItem(cells, 'water-1', 3, 0, 1, 2);
  placeItem(cells, 'ammo-1', 4, 0, 1, 1);
  placeItem(cells, 'knife-1', 5, 0, 1, 2);
  placeItem(cells, 'can-1', 4, 1, 1, 1);
  placeItem(cells, 'flashlight-1', 6, 0, 1, 2);
  placeItem(cells, 'pillbottle-1', 7, 0, 1, 1);
  placeItem(cells, 'berries-1', 7, 1, 1, 1);
  placeItem(cells, 'multitool-1', 8, 0, 1, 1);
  return cells;
}

function createMedkitGrid(): Array<Array<string | null>> {
  const cells = createEmptyGrid(3, 3);
  placeItem(cells, 'pills-1', 0, 0, 1, 1);
  return cells;
}

function createGroundGrid(): Array<Array<string | null>> {
  const cells = createEmptyGrid(10, 40);
  placeItem(cells, 'coat-1', 0, 0, 2, 3);
  placeItem(cells, 'rifle-1', 3, 0, 2, 6);
  placeItem(cells, 'crowbar-1', 6, 0, 1, 4);
  return cells;
}

export const initialGrids: GridsMap = {
  'backpack-1': {
    width: 10,
    height: 10,
    cells: createBackpackGrid(),
  },
  'pouch-1': {
    width: 4,
    height: 6,
    cells: createEmptyGrid(4, 6),
  },
  'medkit-1': {
    width: 3,
    height: 3,
    cells: createMedkitGrid(),
  },
  'pillbottle-1': {
    width: 2,
    height: 2,
    cells: createEmptyGrid(2, 2),
  },
  'water-1': {
    width: 2,
    height: 3,
    cells: createEmptyGrid(2, 3),
  },
  ground: {
    width: 10,
    height: 40,
    cells: createGroundGrid(),
  },
};
