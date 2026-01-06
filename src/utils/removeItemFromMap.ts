import type { ItemsMap } from '../types/inventory';

interface RemoveItemFromMapProps {
  items: ItemsMap;
  itemId: string;
}

type RemoveItemFromMapReturn = ItemsMap;

export function removeItemFromMap(props: RemoveItemFromMapProps): RemoveItemFromMapReturn {
  const { items, itemId } = props;
  const { [itemId]: _removed, ...remainingItems } = items;
  return remainingItems;
}
