import type { ContainerItem, Item } from '../types/inventory';

export function isContainer(item: Item | undefined): item is ContainerItem {
  return item?.gridSize !== undefined;
}
