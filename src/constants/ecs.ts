import type { MoveItemReturn, SplitItemReturn } from '../types/ecs';

export const MOVE_ITEM_FAIL: MoveItemReturn = { success: false, merged: false };
export const SPLIT_ITEM_FAIL: SplitItemReturn = { success: false, newEntityId: null };
