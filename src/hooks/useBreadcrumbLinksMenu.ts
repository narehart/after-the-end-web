import { useMemo } from 'react';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/primitives';
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
          path.length > FIRST_INDEX
            ? (): void => {
                menuNavigateToLevel(FIRST_INDEX);
              }
            : undefined,
      },
    ];
    path.forEach((segment, idx) => {
      const isLast = idx === path.length - SECOND_INDEX;
      links.push({
        label: segment.label,
        onClick: isLast
          ? undefined
          : (): void => {
              menuNavigateToLevel(idx + SECOND_INDEX);
            },
      });
    });
    return links;
  }, [path, menuNavigateToLevel, item?.name]);
}
