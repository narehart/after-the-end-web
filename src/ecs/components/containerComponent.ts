/**
 * Container Component
 *
 * Marks an item as having internal storage (backpack, chest, etc.)
 */

import type { EntityId } from '../world';

export interface ContainerComponent {
  gridEntityId: EntityId;
}
