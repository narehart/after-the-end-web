import type { ItemPlacement } from '../types/inventory';
import { GROUND_LAYOUTS } from '../constants/inventory';
import { FIRST_INDEX } from '../constants/array';

export function getRandomGroundLayout(): ItemPlacement[] {
  const index = Math.floor(Math.random() * GROUND_LAYOUTS.length);
  return GROUND_LAYOUTS[index] ?? GROUND_LAYOUTS[FIRST_INDEX] ?? [];
}
