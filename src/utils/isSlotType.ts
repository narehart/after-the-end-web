import { SLOT_LABELS } from '../constants/slotLabels';
import type { SlotType } from '../types/inventory';

export function isSlotType(slot: string): slot is SlotType {
  return slot in SLOT_LABELS;
}
