import type { EquipmentSlot } from '../types/equipment';
import { EQUIPMENT_LABELS } from '../constants/equipment';

export interface FormatSlotLabelProps {
  slotType: EquipmentSlot;
}

export function formatSlotLabel({ slotType }: FormatSlotLabelProps): string {
  return EQUIPMENT_LABELS[slotType];
}
