import type { ContainerItem } from '../types/inventory';

export interface GetContainerSizeProps {
  item: ContainerItem;
}

export function getContainerSize(props: GetContainerSizeProps): number {
  return props.item.gridSize.width * props.item.gridSize.height;
}
