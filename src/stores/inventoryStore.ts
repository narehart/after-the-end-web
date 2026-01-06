import { create } from 'zustand';
import { EQUIPMENT_SLOTS } from '../constants/equipment';
import type { InventoryStore } from '../types/ui';
import { createUISlice } from './slices/uiSlice';
import { createEquipmentSlice } from './slices/equipmentSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import { createConditionsSlice } from './slices/conditionsSlice';
import { createEquipmentActionsSlice } from './slices/equipmentActionsSlice';
import { createInputModeSlice } from './slices/inputModeSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { createMainMenuSlice } from './slices/mainMenuSlice';

export { EQUIPMENT_SLOTS };

export const useInventoryStore = create<InventoryStore>()((...args) => ({
  ...createUISlice(...args),
  ...createEquipmentSlice(...args),
  ...createNavigationSlice(...args),
  ...createConditionsSlice(...args),
  ...createEquipmentActionsSlice(...args),
  ...createInputModeSlice(...args),
  ...createSettingsSlice(...args),
  ...createMainMenuSlice(...args),
}));
