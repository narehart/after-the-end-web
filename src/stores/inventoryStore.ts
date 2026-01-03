import { create } from 'zustand';
import { SLOT_TYPES, SLOT_LABELS } from '../constants/slots';
import type { InventoryStore } from '../types/store';
import { createUISlice } from './slices/uiSlice';
import { createEquipmentSlice } from './slices/equipmentSlice';
import { createItemsSlice } from './slices/itemsSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createConditionsSlice } from './slices/conditionsSlice';
import { createEquipmentActionsSlice } from './slices/equipmentActionsSlice';

export { SLOT_TYPES, SLOT_LABELS };
export type { InventoryStore } from '../types/store';

export const useInventoryStore = create<InventoryStore>()((...args) => ({
  ...createUISlice(...args),
  ...createEquipmentSlice(...args),
  ...createItemsSlice(...args),
  ...createNavigationSlice(...args),
  ...createConditionsSlice(...args),
  ...createEquipmentActionsSlice(...args),
}));
