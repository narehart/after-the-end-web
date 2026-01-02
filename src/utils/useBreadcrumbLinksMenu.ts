import { useMemo } from 'react';
import type { BreadcrumbLink, Item, MenuPathSegment } from '../types/inventory';

export function useBreadcrumbLinksMenu(
  path: MenuPathSegment[],
  item: Item | undefined,
  menuNavigateToLevel: (level: number) => void
): BreadcrumbLink[] {
  return useMemo(() => {
    const itemName = item?.name ?? 'Actions';
    const links: BreadcrumbLink[] = [
      {
        label: itemName,
        onClick:
          path.length > 0
            ? (): void => {
                menuNavigateToLevel(0);
              }
            : undefined,
      },
    ];
    path.forEach((segment, idx) => {
      const isLast = idx === path.length - 1;
      links.push({
        label: segment.label,
        onClick: isLast
          ? undefined
          : (): void => {
              menuNavigateToLevel(idx + 1);
            },
      });
    });
    return links;
  }, [path, menuNavigateToLevel, item?.name]);
}
