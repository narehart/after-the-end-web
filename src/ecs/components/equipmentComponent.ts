/**
 * Equipment Component
 *
 * Equipment slots for characters
 */

import type { EntityId } from '../world';
import type { EquipmentSlot } from '../../types/equipment';

export interface EquipmentComponent {
  slots: Record<EquipmentSlot, EntityId | null>;
}
