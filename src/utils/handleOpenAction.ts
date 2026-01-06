import type { UseMenuContextReturn } from '../types/inventory';

interface HandleOpenActionProps {
  itemId: string;
  context: UseMenuContextReturn;
}

export function handleOpenAction(props: HandleOpenActionProps): void {
  const { itemId, context } = props;
  context.navigateToContainer(itemId, context.panel, context.source === 'equipment');
}
