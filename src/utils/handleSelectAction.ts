import type { HandleSelectActionProps } from '../types/inventory';

export function handleSelectAction(props: HandleSelectActionProps): void {
  const { item, context } = props;
  const { unequipItem, moveItem, closeMenu } = context;

  if (item.data?.containerId !== undefined) {
    const targetContainerId = item.data.containerId;
    const itemId = context.itemId ?? '';

    if (item.data.action === 'unequip') {
      unequipItem(itemId, targetContainerId);
    } else if (item.data.action === 'move') {
      moveItem(itemId, targetContainerId);
    }
  }

  closeMenu();
}
