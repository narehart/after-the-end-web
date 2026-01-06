/**
 * Container Component
 *
 * Marks an item as having internal storage (backpack, chest, etc.)
 */

import type { EntityId } from '../../types/ecs';

export interface ContainerComponent {
  gridEntityId: EntityId;
}
