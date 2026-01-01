import { useRef, useEffect } from 'react';

export default function useModalFocusRestore(actionModal, destinationPickerOpen, focusPanel) {
  const prevModalOpenRef = useRef(false);
  const lastModalContextRef = useRef(null);

  useEffect(() => {
    // Store context when modal opens
    if (actionModal.isOpen && !prevModalOpenRef.current) {
      lastModalContextRef.current = actionModal.context;
    }

    // Restore focus when modal closes
    if (!actionModal.isOpen && prevModalOpenRef.current && !destinationPickerOpen) {
      setTimeout(() => {
        const context = lastModalContextRef.current;
        if (context === 'equipment') {
          focusPanel(0);
        } else if (context === 'grid') {
          focusPanel(1);
        } else if (context === 'ground' || context === 'world') {
          focusPanel(2);
        } else {
          focusPanel(1);
        }
      }, 50);
    }

    prevModalOpenRef.current = actionModal.isOpen;
  }, [actionModal.isOpen, actionModal.context, destinationPickerOpen, focusPanel]);
}
