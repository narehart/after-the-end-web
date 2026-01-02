import { useInventoryStore } from '../stores/inventoryStore';

export default function useInventoryState() {
  const items = useInventoryStore((state) => state.items);
  const closeAllModals = useInventoryStore((state) => state.closeAllModals);
  const setUIScale = useInventoryStore((state) => state.setUIScale);

  return {
    items,
    closeAllModals,
    setUIScale,
  };
}
