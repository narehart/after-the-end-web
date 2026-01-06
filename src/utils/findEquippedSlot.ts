/**
 * Find Equipped Slot
 *
 * Finds which equipment slot (if any) contains the given entity ID.
 */

import type { Equipment, EquipmentSlot } from '../types/equipment';
import { EQUIPMENT_SLOTS } from '../constants/equipment';

interface FindEquippedSlotProps {
  equipment: Equipment;
  entityId: string;
}

export function findEquippedSlot(props: FindEquippedSlotProps): EquipmentSlot | null {
  const { equipment, entityId } = props;

  for (const slot of EQUIPMENT_SLOTS) {
    if (equipment[slot] === entityId) {
      return slot;
    }
  }

  return null;
}
