import type { ContainerInfo, MenuItem, UseMenuContextReturn } from '../types/inventory';
import { buildDestinationItems } from './buildDestinationItems';

interface CreateContainerItemProps {
  info: ContainerInfo;
  canFit: boolean;
  newPath: string[];
  action: string;
}

type CreateContainerItemReturn = MenuItem;

export function createContainerItem(props: CreateContainerItemProps): CreateContainerItemReturn {
  const { info, canFit, newPath, action } = props;
  return {
    id: info.id,
    label: info.name,
    type: 'navigate',
    hasChildren: true,
    disabled: (): boolean => !canFit,
    meta: info.capacity,
    data: { containerId: info.id, action },
    getItems: (ctx2: UseMenuContextReturn): MenuItem[] =>
      buildDestinationItems(ctx2, newPath, action),
  };
}
