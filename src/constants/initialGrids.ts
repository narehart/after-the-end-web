import type { GridsMap } from '../types/inventory';
import { buildGridWithItems } from '../utils/buildGridWithItems';
import { createEmptyGrid } from '../utils/createEmptyGrid';

export const initialGrids: GridsMap = {
  'backpack-1': {
    width: 10,
    height: 10,
    cells: buildGridWithItems({
      width: 10,
      height: 10,
      items: [
        { id: 'medkit-1', x: 0, y: 0, width: 3, height: 3 },
        { id: 'water-1', x: 3, y: 0, width: 1, height: 2 },
        { id: 'ammo-1', x: 4, y: 0, width: 1, height: 1 },
        { id: 'knife-1', x: 5, y: 0, width: 1, height: 2 },
        { id: 'can-1', x: 4, y: 1, width: 1, height: 1 },
        { id: 'flashlight-1', x: 6, y: 0, width: 1, height: 2 },
        { id: 'pillbottle-1', x: 7, y: 0, width: 1, height: 1 },
        { id: 'berries-1', x: 7, y: 1, width: 1, height: 1 },
        { id: 'multitool-1', x: 8, y: 0, width: 1, height: 1 },
      ],
    }),
  },
  'pouch-1': {
    width: 4,
    height: 6,
    cells: createEmptyGrid({ width: 4, height: 6 }),
  },
  'medkit-1': {
    width: 3,
    height: 3,
    cells: buildGridWithItems({
      width: 3,
      height: 3,
      items: [{ id: 'pills-1', x: 0, y: 0, width: 1, height: 1 }],
    }),
  },
  'pillbottle-1': {
    width: 2,
    height: 2,
    cells: createEmptyGrid({ width: 2, height: 2 }),
  },
  'water-1': {
    width: 2,
    height: 3,
    cells: createEmptyGrid({ width: 2, height: 3 }),
  },
  ground: {
    width: 10,
    height: 40,
    cells: buildGridWithItems({
      width: 10,
      height: 40,
      items: [
        { id: 'coat-1', x: 0, y: 0, width: 2, height: 3 },
        { id: 'rifle-1', x: 3, y: 0, width: 2, height: 6 },
        { id: 'crowbar-1', x: 6, y: 0, width: 1, height: 4 },
      ],
    }),
  },
};
