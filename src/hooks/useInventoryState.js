import { useInventoryStore } from '../stores/inventoryStore';

export default function useInventoryState() {
  const actionModal = useInventoryStore((state) => state.actionModal);
  const destinationPicker = useInventoryStore((state) => state.destinationPicker);
  const items = useInventoryStore((state) => state.items);
  const closeActionModal = useInventoryStore((state) => state.closeActionModal);
  const closeDestinationPicker = useInventoryStore((state) => state.closeDestinationPicker);
  const closeAllModals = useInventoryStore((state) => state.closeAllModals);
  const setUIScale = useInventoryStore((state) => state.setUIScale);

  return {
    actionModal,
    destinationPicker,
    items,
    closeActionModal,
    closeDestinationPicker,
    closeAllModals,
    setUIScale,
  };
}
