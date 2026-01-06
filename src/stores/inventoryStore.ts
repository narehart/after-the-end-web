import { create } from 'zustand';
import { SLOT_TYPES } from '../constants/slots';
import type { InventoryStore } from '../types/store';
import { createUISlice } from './slices/uiSlice';
import { createEquipmentSlice } from './slices/equipmentSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createConditionsSlice } from './slices/conditionsSlice';
import { createEquipmentActionsSlice } from './slices/equipmentActionsSlice';
import { createInputModeSlice } from './slices/inputModeSlice';

export { SLOT_TYPES };

export const useInventoryStore = create<InventoryStore>()((...args) => ({
  ...createUISlice(...args),
  ...createEquipmentSlice(...args),
  ...createNavigationSlice(...args),
  ...createConditionsSlice(...args),
  ...createEquipmentActionsSlice(...args),
  ...createInputModeSlice(...args),
}));
