import { useMemo } from 'react';
import type { BreadcrumbLink, ItemsMap, PanelType } from '../types/inventory';

export function useBreadcrumbLinksContainer(
  panelLabel: string,
  focusPath: string[],
  items: ItemsMap,
  onNavigateBack: (index: number) => void,
  panelType: PanelType
): BreadcrumbLink[] {
  return useMemo(() => {
    // For world panel at ground level, don't show redundant "ground" breadcrumb
    const isGroundRoot =
      panelType === 'world' && focusPath.length === 1 && focusPath[0] === 'ground';
    if (isGroundRoot) {
      return [{ label: panelLabel }];
    }

    // First link is never clickable - it's just a label, not a container
    const links: BreadcrumbLink[] = [
      {
        label: panelLabel,
      },
    ];
    focusPath.forEach((id, index) => {
      const isLast = index === focusPath.length - 1;
      links.push({
        label: items[id]?.name ?? id,
        onClick: isLast
          ? undefined
          : () => {
              onNavigateBack(index);
            },
      });
    });
    return links;
  }, [panelLabel, focusPath, items, onNavigateBack, panelType]);
}
