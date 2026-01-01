import { useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';

export default function useDestinationHandler() {
  const openDestinationPicker = useInventoryStore((state) => state.openDestinationPicker);
  const closeAllModals = useInventoryStore((state) => state.closeAllModals);
  const unequipItem = useInventoryStore((state) => state.unequipItem);
  const destinationPicker = useInventoryStore((state) => state.destinationPicker);
  const actionModal = useInventoryStore((state) => state.actionModal);

  const handleDestinationPick = useCallback((action, buttonYOffset = 0) => {
    openDestinationPicker(action, actionModal.itemId, buttonYOffset);
  }, [openDestinationPicker, actionModal.itemId]);

  const handleDestinationSelect = useCallback((destination) => {
    const { action, itemId } = destinationPicker;

    if (action === 'unequip') {
      const success = unequipItem(itemId, destination.id);
      if (!success) {
        console.error('Failed to unequip item - no space in destination');
      }
    } else if (action === 'move') {
      console.log(`Moving item ${itemId} to ${destination.id}`);
    }

    closeAllModals();
  }, [destinationPicker, unequipItem, closeAllModals]);

  return {
    handleDestinationPick,
    handleDestinationSelect,
  };
}
