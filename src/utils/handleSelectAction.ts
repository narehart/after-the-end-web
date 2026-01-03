import type { HandleSelectActionProps } from '../types/inventory';

export function handleSelectAction(props: HandleSelectActionProps): void {
  const { item, context } = props;
  const { unequipItem, closeMenu } = context;
  if (item.data?.action === 'unequip' && item.data.containerId !== undefined) {
    unequipItem(context.itemId ?? '', item.data.containerId);
  }
  closeMenu();
}
