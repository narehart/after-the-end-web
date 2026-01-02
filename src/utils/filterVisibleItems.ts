import type { MenuItem, MenuContext } from '../types/inventory';

export function filterVisibleItems(items: MenuItem[], context: MenuContext): MenuItem[] {
  return items.filter((item) => {
    if (typeof item.show === 'function') {
      return item.show(context);
    }
    return item.show !== false;
  });
}
