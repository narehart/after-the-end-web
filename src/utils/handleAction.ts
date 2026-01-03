import type { HandleActionProps } from '../types/inventory';

export function handleAction(props: HandleActionProps): void {
  const { item, context } = props;
  const { navigateToContainer, rotateItem, equipItem, closeMenu } = context;
  const itemId = context.itemId;
  if (itemId === null) {
    closeMenu();
    return;
  }
  if (item.id === 'open') {
    navigateToContainer(itemId, context.panel, context.source === 'equipment');
    closeMenu();
  } else if (item.id === 'rotate') {
    rotateItem(itemId);
  } else if (item.id === 'equip') {
    equipItem(itemId);
    closeMenu();
  } else {
    closeMenu();
  }
}
