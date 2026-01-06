import { FIRST_INDEX } from '../constants/primitives';
import { useInventoryStore } from '../stores/inventoryStore';

interface UseSlotFocusProps {
  itemId: string | null;
}

interface UseSlotFocusReturn {
  isFocused: boolean;
  isHovered: boolean;
  hasOpenModal: boolean;
}

export default function useSlotFocus({ itemId }: UseSlotFocusProps): UseSlotFocusReturn {
  const inventoryFocusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const selectedItemId = useInventoryStore((state) => state.selectedItemId);
  const menuIsOpen = useInventoryStore((state) => state.menu.isOpen);
  const menuItemId = useInventoryStore((state) => state.menu.itemId);

  const isFocused = inventoryFocusPath[FIRST_INDEX] === itemId;
  const isHovered = itemId !== null && itemId === selectedItemId;
  const hasOpenModal = menuIsOpen && menuItemId === itemId;

  return { isFocused, isHovered, hasOpenModal };
}
