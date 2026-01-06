import type { HandleActionProps } from '../types/inventory';
import { handleOpenAction } from './handleOpenAction';
import { handleTakeAction } from './handleTakeAction';

export function handleAction(props: HandleActionProps): void {
  const { item, context } = props;
  const { rotateItem, equipItem, unequipItem, moveItem, destroyItem, emptyContainer, closeMenu } =
    context;
  const itemId = context.itemId;

  if (itemId === null) {
    closeMenu();
    return;
  }

  if (item.id === 'open') {
    handleOpenAction({ itemId, context });
  } else if (item.id === 'rotate') {
    rotateItem(itemId);
    return;
  } else if (item.id === 'equip') {
    equipItem(itemId);
  } else if (item.id === 'drop') {
    if (context.source === 'equipment') {
      unequipItem(itemId, 'ground');
    } else {
      moveItem(itemId, 'ground');
    }
  } else if (item.id === 'take') {
    handleTakeAction({ itemId, context });
  } else if (item.id === 'destroy') {
    destroyItem(itemId);
  } else if (item.id === 'empty') {
    emptyContainer(itemId);
  }

  closeMenu();
}
