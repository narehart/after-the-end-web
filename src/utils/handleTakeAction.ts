import type { UseMenuContextReturn } from '../types/inventory';
import { findFirstAvailableContainer } from './findFirstAvailableContainer';

interface HandleTakeActionProps {
  itemId: string;
  context: UseMenuContextReturn;
}

export function handleTakeAction(props: HandleTakeActionProps): void {
  const { itemId, context } = props;
  const target = findFirstAvailableContainer(context);
  if (target !== null) {
    context.moveItem(itemId, target);
  }
}
