import { create } from 'zustand';
import { SLOT_TYPES, SLOT_LABELS } from '../constants/slots';
import { createUISlice } from './slices/uiSlice';
import type { UISlice } from './slices/uiSlice';
import { createEquipmentSlice } from './slices/equipmentSlice';
import type { EquipmentSlice } from './slices/equipmentSlice';
import { createItemsSlice } from './slices/itemsSlice';
import type { ItemsSlice } from './slices/itemsSlice';
import { createNavigationSlice } from './slices/navigationSlice';
import type { NavigationSlice } from './slices/navigationSlice';
import { createConditionsSlice } from './slices/conditionsSlice';
import type { ConditionsSlice } from './slices/conditionsSlice';
import { createEquipmentActionsSlice } from './slices/equipmentActionsSlice';
import type { EquipmentActionsSlice } from './slices/equipmentActionsSlice';

export { SLOT_TYPES, SLOT_LABELS };

export type InventoryStore = UISlice &
  EquipmentSlice &
  ItemsSlice &
  NavigationSlice &
  ConditionsSlice &
  EquipmentActionsSlice;

export const useInventoryStore = create<InventoryStore>()((...args) => ({
  ...createUISlice(...args),
  ...createEquipmentSlice(...args),
  ...createItemsSlice(...args),
  ...createNavigationSlice(...args),
  ...createConditionsSlice(...args),
  ...createEquipmentActionsSlice(...args),
}));
