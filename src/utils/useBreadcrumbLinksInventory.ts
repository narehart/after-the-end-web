import { useMemo } from 'react';
import { SECOND_INDEX } from '../constants/numbers';
import type { BreadcrumbLink } from '../types/inventory';
import type { UseBreadcrumbLinksInventoryProps } from '../types/utils';

export function useBreadcrumbLinksInventory(
  props: UseBreadcrumbLinksInventoryProps
): BreadcrumbLink[] {
  const { focusPath, items, navigateBack } = props;
  return useMemo(() => {
    // "Inventory" is never clickable - it's just a label, not a container
    const links: BreadcrumbLink[] = [
      {
        label: 'Inventory',
      },
    ];
    focusPath.forEach((id, index) => {
      const isLast = index === focusPath.length - SECOND_INDEX;
      links.push({
        label: items[id]?.name ?? id,
        onClick: isLast
          ? undefined
          : () => {
              navigateBack(index, 'inventory');
            },
      });
    });
    return links;
  }, [focusPath, items, navigateBack]);
}
