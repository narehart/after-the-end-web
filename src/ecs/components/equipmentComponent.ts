/**
 * Equipment Component
 *
 * Equipment slots for characters
 */

import type { EntityId } from '../world';
import type { SlotType } from '../../types/inventory';

export interface EquipmentComponent {
  slots: Record<SlotType, EntityId | null>;
}
