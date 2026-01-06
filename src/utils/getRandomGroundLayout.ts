import type { ItemPlacement } from '../types/ui';
import { GROUND_LAYOUTS } from '../constants/ground';
import { FIRST_INDEX } from '../constants/array';

;

export function getRandomGroundLayout(): ItemPlacement[] {
  const index = Math.floor(Math.random() * GROUND_LAYOUTS.length);
  return GROUND_LAYOUTS[index] ?? GROUND_LAYOUTS[FIRST_INDEX] ?? [];
}
