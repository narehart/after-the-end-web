import type { HandleActionProps } from '../types/inventory';
import { findFirstAvailableContainer } from './findFirstAvailableContainer';

export function handleAction(props: HandleActionProps): void {
  const { item, context } = props;
  const { navigateToContainer, rotateItem, equipItem, moveItem, closeMenu } = context;
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
  } else if (item.id === 'drop') {
    moveItem(itemId, 'ground');
    closeMenu();
  } else if (item.id === 'take') {
    const targetContainer = findFirstAvailableContainer(context);
    if (targetContainer !== null) {
      moveItem(itemId, targetContainer);
    }
    closeMenu();
  } else {
    closeMenu();
  }
}
