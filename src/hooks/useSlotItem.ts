import { useInventoryStore } from '../stores/inventoryStore';
import type { EquipmentSlot } from '../types/equipment';
import type { Item } from '../types/inventory';
import useECSInventory from './useECSInventory';

interface UseSlotItemProps {
  slotType: EquipmentSlot;
}

interface UseSlotItemReturn {
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
}

export default function useSlotItem({ slotType }: UseSlotItemProps): UseSlotItemReturn {
  const equipment = useInventoryStore((state) => state.equipment);
  const { itemsMap: items } = useECSInventory();

  const itemId = equipment[slotType];
  const item = itemId !== null ? (items[itemId] ?? null) : null;
  const hasGrid = item?.gridSize !== undefined;

  return { item, itemId, hasGrid };
}
