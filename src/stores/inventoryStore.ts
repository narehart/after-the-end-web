import { create } from 'zustand';
import type { SlotType } from '../types/inventory';
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

export type InventoryStore = UISlice &
  EquipmentSlice &
  ItemsSlice &
  NavigationSlice &
  ConditionsSlice &
  EquipmentActionsSlice;

export const SLOT_TYPES: SlotType[] = [
  'helmet',
  'eyes',
  'face',
  'neck',
  'backpack',
  'coat',
  'vest',
  'shirt',
  'rightShoulder',
  'leftShoulder',
  'rightGlove',
  'leftGlove',
  'rightRing',
  'leftRing',
  'rightHolding',
  'leftHolding',
  'pouch',
  'pants',
  'rightShoe',
  'leftShoe',
];

export const SLOT_LABELS: Record<SlotType, string> = {
  helmet: 'Helmet',
  eyes: 'Eyes',
  face: 'Face',
  neck: 'Neck',
  backpack: 'Backpack',
  coat: 'Coat',
  vest: 'Vest',
  shirt: 'Shirt',
  rightShoulder: 'Right Shoulder',
  leftShoulder: 'Left Shoulder',
  rightGlove: 'Right Glove',
  leftGlove: 'Left Glove',
  rightRing: 'Right Ring',
  leftRing: 'Left Ring',
  rightHolding: 'Right Holding',
  leftHolding: 'Left Holding',
  pouch: 'Pouch',
  pants: 'Pants',
  rightShoe: 'Right Shoe',
  leftShoe: 'Left Shoe',
};

export const useInventoryStore = create<InventoryStore>()((...args) => ({
  ...createUISlice(...args),
  ...createEquipmentSlice(...args),
  ...createItemsSlice(...args),
  ...createNavigationSlice(...args),
  ...createConditionsSlice(...args),
  ...createEquipmentActionsSlice(...args),
}));
