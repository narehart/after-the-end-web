import { useInventoryStore } from '../stores/inventoryStore';
import type { ItemsMap, ContainerRect } from '../types/inventory';
import useECSInventory from './useECSInventory';

interface UseInventoryStateReturn {
  items: ItemsMap;
  closeAllModals: () => void;
  setUIScale: (scale: number, containerRect?: ContainerRect | null) => void;
}

export default function useInventoryState(): UseInventoryStateReturn {
  const { itemsMap: items } = useECSInventory();
  const closeAllModals = useInventoryStore((state) => state.closeAllModals);
  const setUIScale = useInventoryStore((state) => state.setUIScale);

  return {
    items,
    closeAllModals,
    setUIScale,
  };
}
