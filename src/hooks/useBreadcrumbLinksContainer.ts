import { useMemo } from 'react';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/array';
import { EQUIPMENT_LABELS } from '../constants/equipment';
import type { Equipment } from '../types/equipment';
import type { BreadcrumbLink, ItemsMap, PanelType } from '../types/inventory';
import { isEquipmentSlot } from '../utils/isEquipmentSlot';

interface UseBreadcrumbLinksContainerProps {
  panelLabel: string;
  focusPath: string[];
  items: ItemsMap;
  equipment: Equipment;
  onNavigateBack: (index: number) => void;
  panelType: PanelType;
}

export function useBreadcrumbLinksContainer(
  props: UseBreadcrumbLinksContainerProps
): BreadcrumbLink[] {
  const { panelLabel, focusPath, items, equipment, onNavigateBack, panelType } = props;
  return useMemo(() => {
    // For world panel at ground level, don't show redundant "ground" breadcrumb
    const isGroundRoot =
      panelType === 'world' &&
      focusPath.length === SECOND_INDEX &&
      focusPath[FIRST_INDEX] === 'ground';
    if (isGroundRoot) {
      return [{ label: panelLabel }];
    }

    // Find the equipment slot label for an item (for inventory breadcrumbs)
    const getSlotLabelForItem = (itemId: string): string | null => {
      for (const [slot, equippedId] of Object.entries(equipment)) {
        if (equippedId === itemId && isEquipmentSlot(slot)) {
          return EQUIPMENT_LABELS[slot];
        }
      }
      return null;
    };

    // First link is never clickable - it's just a label, not a container
    const links: BreadcrumbLink[] = [
      {
        label: panelLabel,
      },
    ];
    focusPath.forEach((id, index) => {
      const isLast = index === focusPath.length - SECOND_INDEX;
      const item = items[id];

      // For inventory panel, first level shows equipment slot name
      let label = item?.name ?? item?.description ?? id;
      if (panelType === 'inventory' && index === FIRST_INDEX) {
        const slotLabel = getSlotLabelForItem(id);
        if (slotLabel !== null) {
          label = slotLabel;
        }
      }

      links.push({
        label,
        onClick: isLast
          ? undefined
          : () => {
              onNavigateBack(index);
            },
      });
    });
    return links;
  }, [panelLabel, focusPath, items, equipment, onNavigateBack, panelType]);
}
