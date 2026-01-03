import type { MenuState } from '../types/inventory';

export const INITIAL_MENU: MenuState = {
  isOpen: false,
  position: null,
  targetItemId: null,
  targetSlotType: null,
  itemId: null,
  source: null,
  path: [],
  focusIndex: 0,
};
