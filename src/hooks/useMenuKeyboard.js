import { useEffect, useState, useCallback } from 'react';

export default function useMenuKeyboard({
  items,
  focusIndex,
  path,
  isOpen,
  onNavigateBack,
  onClose,
  onSelect,
  onSetFocus,
}) {
  const [isReady, setIsReady] = useState(false);

  // Delay input handling to prevent accidental immediate actions
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
    setIsReady(false);
    return undefined;
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isReady || !items || items.length === 0) return;

      const handlers = {
        ArrowUp: () => {
          e.preventDefault();
          onSetFocus(focusIndex > 0 ? focusIndex - 1 : items.length - 1);
        },
        ArrowDown: () => {
          e.preventDefault();
          onSetFocus(focusIndex < items.length - 1 ? focusIndex + 1 : 0);
        },
        ArrowRight: () => {
          e.preventDefault();
          const item = items[focusIndex];
          if (item?.hasChildren && item?.getItems) {
            onSelect(item);
          }
        },
        ArrowLeft: () => {
          e.preventDefault();
          if (path.length > 0) {
            onNavigateBack();
          }
        },
        Enter: () => {
          e.preventDefault();
          const item = items[focusIndex];
          if (item) {
            onSelect(item);
          }
        },
        Escape: () => {
          e.preventDefault();
          if (path.length > 0) {
            onNavigateBack();
          } else {
            onClose();
          }
        },
        Backspace: () => {
          e.preventDefault();
          if (path.length > 0) {
            onNavigateBack();
          }
        },
      };

      // Space key (same as Enter)
      if (e.key === ' ') {
        handlers.Enter();
        return;
      }

      const handler = handlers[e.key];
      if (handler) {
        handler();
      }
    },
    [isReady, items, focusIndex, path, onNavigateBack, onClose, onSelect, onSetFocus]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);
}
