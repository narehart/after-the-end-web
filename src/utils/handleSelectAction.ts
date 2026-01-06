import type { MenuItem, UseMenuContextReturn } from '../types/inventory';

interface HandleSelectActionProps {
  item: MenuItem;
  context: UseMenuContextReturn;
}

export function handleSelectAction(props: HandleSelectActionProps): void {
  const { item, context } = props;
  const { unequipItem, moveItem, splitItem, closeMenu } = context;

  if (item.data?.containerId !== undefined) {
    const targetContainerId = item.data.containerId;
    const itemId = context.itemId ?? '';

    if (item.data.action === 'unequip') {
      unequipItem(itemId, targetContainerId);
    } else if (item.data.action === 'move') {
      moveItem(itemId, targetContainerId);
    } else if (item.data.action === 'split') {
      splitItem(itemId, targetContainerId);
    }
  }

  closeMenu();
}
