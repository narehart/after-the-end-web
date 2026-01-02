import { useCallback } from 'react';
import type { MenuContext, MenuItem, MenuPathSegment } from '../types/inventory';
import { handleNavigateAction } from './handleNavigateAction';
import { handleSelectAction } from './handleSelectAction';
import { handleAction } from './handleAction';

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
