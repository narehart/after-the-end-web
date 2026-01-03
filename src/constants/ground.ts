import type { ItemPlacement } from '../types/ui';

// Pre-defined ground item configurations - each is a valid non-overlapping layout
export const GROUND_LAYOUTS: ItemPlacement[][] = [
  [
    { id: 'neo_1', x: 0, y: 0 }, // bag
    { id: 'neo_318', x: 5, y: 0 }, // flashlight
    { id: 'neo_136', x: 8, y: 0 }, // bottle
    { id: 'neo_3', x: 0, y: 6 }, // branch
  ],
  [
    { id: 'neo_327', x: 0, y: 0 }, // laptop
    { id: 'neo_4', x: 6, y: 0 }, // tin can
    { id: 'neo_104', x: 0, y: 3 }, // metal pot
    { id: 'neo_318', x: 5, y: 3 }, // flashlight
  ],
  [
    { id: 'neo_136', x: 0, y: 0 }, // bottle
    { id: 'neo_3', x: 2, y: 0 }, // branch
    { id: 'neo_1', x: 4, y: 0 }, // bag
    { id: 'neo_327', x: 0, y: 6 }, // laptop
    { id: 'neo_4', x: 6, y: 6 }, // tin can
  ],
  [
    { id: 'neo_104', x: 0, y: 0 }, // metal pot
    { id: 'neo_318', x: 5, y: 0 }, // flashlight
    { id: 'neo_136', x: 8, y: 0 }, // bottle
    { id: 'neo_1', x: 0, y: 2 }, // bag
    { id: 'neo_3', x: 5, y: 2 }, // branch
  ],
  [
    { id: 'neo_4', x: 0, y: 0 }, // tin can
    { id: 'neo_327', x: 3, y: 0 }, // laptop
    { id: 'neo_136', x: 8, y: 0 }, // bottle
    { id: 'neo_318', x: 0, y: 3 }, // flashlight
  ],
];

export const GROUND_WIDTH = 10;
export const GROUND_HEIGHT = 40;
