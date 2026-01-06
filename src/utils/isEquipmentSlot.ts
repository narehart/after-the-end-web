import { EQUIPMENT_LABELS } from '../constants/equipment';
import type { EquipmentSlot } from '../types/equipment';

export function isEquipmentSlot(slot: string): slot is EquipmentSlot {
  return slot in EQUIPMENT_LABELS;
}
