import type { MenuItem, UseMenuContextReturn } from '../types/inventory';

interface FilterVisibleItemsProps {
  items: MenuItem[];
  context: UseMenuContextReturn;
}

export function filterVisibleItems(props: FilterVisibleItemsProps): MenuItem[] {
  const { items, context } = props;
  return items.filter((item) => {
    if (typeof item.show === 'function') {
      return item.show(context);
    }
    return item.show !== false;
  });
}
