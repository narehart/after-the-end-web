import { useInventoryStore } from '../stores/inventoryStore';
import type { SlotType, Item } from '../types/inventory';

interface UseSlotItemProps {
  slotType: SlotType;
}

interface UseSlotItemReturn {
  item: Item | null;
  itemId: string | null;
  hasGrid: boolean;
}

export default function useSlotItem({ slotType }: UseSlotItemProps): UseSlotItemReturn {
  const equipment = useInventoryStore((state) => state.equipment);
  const items = useInventoryStore((state) => state.items);

  const itemId = equipment[slotType];
  const item = itemId !== null ? (items[itemId] ?? null) : null;
  const hasGrid = item?.gridSize !== undefined;

  return { item, itemId, hasGrid };
}
