import { useCallback } from 'react';
import type { MenuItem, MenuPathSegment, UseMenuContextReturn } from '../types/inventory';
import { handleNavigateAction } from '../utils/handleNavigateAction';
import { handleSelectAction } from '../utils/handleSelectAction';
import { handleAction } from '../utils/handleAction';

interface UseMenuActionsProps {
  context: UseMenuContextReturn;
}

export function useMenuActions(
  props: UseMenuActionsProps,
  menuNavigateTo: (segment: MenuPathSegment) => void
): (item: MenuItem) => void {
  const { context } = props;
  return useCallback(
    (item: MenuItem): void => {
      switch (item.type) {
        case 'navigate':
          handleNavigateAction({ item }, menuNavigateTo);
          break;
        case 'select':
          handleSelectAction({ item, context });
          break;
        case 'action':
          handleAction({ item, context });
          break;
      }
    },
    [context, menuNavigateTo]
  );
}
