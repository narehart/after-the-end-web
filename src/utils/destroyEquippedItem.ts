import type { Equipment, ItemsMap, SlotType } from '../types/inventory';
import { findEquipmentSlot } from './findEquipmentSlot';

interface DestroyEquippedItemProps {
  items: ItemsMap;
  equipment: Equipment;
  itemId: string;
}

interface DestroyEquippedItemReturn {
  items: ItemsMap;
  equipment: Equipment;
}

export function destroyEquippedItem(
  props: DestroyEquippedItemProps
): DestroyEquippedItemReturn | null {
  const { items, equipment, itemId } = props;

  const equipmentSlot: SlotType | null = findEquipmentSlot({ equipment, itemId });
  if (equipmentSlot === null) return null;

  const { [itemId]: _removed, ...remainingItems } = items;

  return {
    items: remainingItems,
    equipment: { ...equipment, [equipmentSlot]: null },
  };
}
