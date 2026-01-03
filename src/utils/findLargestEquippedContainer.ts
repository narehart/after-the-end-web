import type { ContainerItem, Equipment, ItemsMap } from '../types/inventory';
import { FIRST_INDEX } from '../constants/numbers';
import { getContainerSize } from './getContainerSize';
import { isContainer } from './isContainer';

export interface FindLargestEquippedContainerProps {
  equipment: Equipment;
  items: ItemsMap;
}

export function findLargestEquippedContainer({
  equipment,
  items,
}: FindLargestEquippedContainerProps): string | null {
  const equippedIds = Object.values(equipment).filter((id): id is string => id !== null);

  const containers: ContainerItem[] = equippedIds
    .map((id) => items[id])
    .filter(isContainer)
    .sort((a, b) => getContainerSize({ item: b }) - getContainerSize({ item: a }));

  return containers[FIRST_INDEX]?.id ?? null;
}
