import type { EntityId } from '../ecs/world';

export interface MoveItemReturn {
  success: boolean;
  merged: boolean;
}

export interface SplitItemReturn {
  success: boolean;
  newEntityId: EntityId | null;
}
