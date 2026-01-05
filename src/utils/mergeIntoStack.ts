import { DEFAULT_QUANTITY } from '../constants/numbers';
import type { Item, ItemsMap } from '../types/inventory';

interface MergeIntoStackProps {
  items: ItemsMap;
  sourceItemId: string;
  targetItemId: string;
  addQuantity: number;
}

interface MergeIntoStackReturn {
  items: ItemsMap;
}

export function mergeIntoStack(props: MergeIntoStackProps): MergeIntoStackReturn | null {
  const { items, sourceItemId, targetItemId, addQuantity } = props;

  const sourceItem = items[sourceItemId];
  const targetItem = items[targetItemId];
  if (sourceItem === undefined || targetItem === undefined) return null;

  const sourceQty = sourceItem.quantity ?? DEFAULT_QUANTITY;
  const targetQty = targetItem.quantity ?? DEFAULT_QUANTITY;

  const updatedSourceItem: Item = {
    ...sourceItem,
    quantity: sourceQty - addQuantity,
  };

  const updatedTargetItem: Item = {
    ...targetItem,
    quantity: targetQty + addQuantity,
  };

  return {
    items: {
      ...items,
      [sourceItemId]: updatedSourceItem,
      [targetItemId]: updatedTargetItem,
    },
  };
}
