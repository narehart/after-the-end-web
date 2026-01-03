import type { HandleNavigateActionProps, MenuPathSegment } from '../types/inventory';

export function handleNavigateAction(
  props: HandleNavigateActionProps,
  menuNavigateTo: (s: MenuPathSegment) => void
): void {
  const { item } = props;
  if (item.getItems !== undefined) {
    menuNavigateTo({ id: item.id, label: item.label });
  }
}
