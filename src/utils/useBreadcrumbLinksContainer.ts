import { useMemo } from 'react';
import type { BreadcrumbLink } from '../types/inventory';
import type { UseBreadcrumbLinksContainerProps } from '../types/utils';

export function useBreadcrumbLinksContainer(
  props: UseBreadcrumbLinksContainerProps
): BreadcrumbLink[] {
  const { panelLabel, focusPath, items, onNavigateBack, panelType } = props;
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
