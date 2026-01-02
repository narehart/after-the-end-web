import { useCallback } from 'react';
import type { MenuContext, MenuItem, MenuPathSegment } from '../types/inventory';

export function handleNavigateAction(
  item: MenuItem,
  menuNavigateTo: (s: MenuPathSegment) => void
): void {
  if (item.getItems !== undefined) {
    menuNavigateTo({ id: item.id, label: item.label });
  }
}

export function handleSelectAction(item: MenuItem, context: MenuContext): void {
  const { unequipItem, closeMenu } = context;
  if (item.data?.action === 'unequip' && item.data.containerId !== undefined) {
    unequipItem(context.itemId ?? '', item.data.containerId);
  }
  closeMenu();
}

export function handleAction(item: MenuItem, context: MenuContext): void {
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

export function useMenuActions(
  context: MenuContext,
  menuNavigateTo: (segment: MenuPathSegment) => void
): (item: MenuItem) => void {
  return useCallback(
    (item: MenuItem): void => {
      switch (item.type) {
        case 'navigate':
          handleNavigateAction(item, menuNavigateTo);
          break;
        case 'select':
          handleSelectAction(item, context);
          break;
        case 'action':
          handleAction(item, context);
          break;
      }
    },
    [context, menuNavigateTo]
  );
}
