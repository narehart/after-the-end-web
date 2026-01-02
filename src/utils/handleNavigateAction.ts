import type { MenuItem, MenuPathSegment } from '../types/inventory';

export function handleNavigateAction(
  item: MenuItem,
  menuNavigateTo: (s: MenuPathSegment) => void
): void {
  if (item.getItems !== undefined) {
    menuNavigateTo({ id: item.id, label: item.label });
  }
}
