import { useMemo } from 'react';
import type { BreadcrumbLink, ItemsMap } from '../types/inventory';

export function useBreadcrumbLinksInventory(
  focusPath: string[],
  items: ItemsMap,
  navigateBack: (index: number, panel: string) => void
): BreadcrumbLink[] {
  return useMemo(() => {
    // "Inventory" is never clickable - it's just a label, not a container
    const links: BreadcrumbLink[] = [
      {
        label: 'Inventory',
      },
    ];
    focusPath.forEach((id, index) => {
      const isLast = index === focusPath.length - 1;
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
