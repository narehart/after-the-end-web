import type { MoveItemReturn } from '../ecs/systems/moveItemSystem';
import type { SplitItemReturn } from '../ecs/systems/splitItemSystem';

export const MOVE_ITEM_FAIL: MoveItemReturn = { success: false, merged: false };
export const SPLIT_ITEM_FAIL: SplitItemReturn = { success: false, newEntityId: null };
