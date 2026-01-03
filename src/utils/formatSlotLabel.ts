import type { SlotType } from '../types/inventory';
import { SLOT_LABELS } from '../constants/slotLabels';

export interface FormatSlotLabelProps {
  slotType: SlotType;
}

export function formatSlotLabel({ slotType }: FormatSlotLabelProps): string {
  return SLOT_LABELS[slotType];
}
