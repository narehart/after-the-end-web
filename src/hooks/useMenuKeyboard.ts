import { useEffect, useState, useCallback } from 'react';
import type { MenuItem, MenuPathSegment } from '../types/inventory';

interface UseMenuKeyboardProps {
  items: MenuItem[];
  focusIndex: number;
  path: MenuPathSegment[];
  isOpen: boolean;
  onNavigateBack: () => void;
  onClose: () => void;
  onSelect: (item: MenuItem) => void;
  onSetFocus: (index: number) => void;
}

type KeyHandler = () => void;

export default function useMenuKeyboard({
  items,
  focusIndex,
  path,
  isOpen,
  onNavigateBack,
  onClose,
  onSelect,
  onSetFocus,
}: UseMenuKeyboardProps): void {
  const [isReady, setIsReady] = useState(false);

  // Delay input handling to prevent accidental immediate actions
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout((): void => {
        setIsReady(true);
      }, 100);
      return (): void => {
        clearTimeout(timer);
      };
    }
    setIsReady(false);
    return undefined;
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!isReady || items.length === 0) return;

      const handlers: Record<string, KeyHandler> = {
        ArrowUp: (): void => {
          e.preventDefault();
          onSetFocus(focusIndex > 0 ? focusIndex - 1 : items.length - 1);
        },
        ArrowDown: (): void => {
          e.preventDefault();
          onSetFocus(focusIndex < items.length - 1 ? focusIndex + 1 : 0);
        },
        ArrowRight: (): void => {
          e.preventDefault();
          const item = items[focusIndex];
          if (item?.hasChildren === true && item.getItems !== undefined) {
            onSelect(item);
          }
        },
        ArrowLeft: (): void => {
          e.preventDefault();
          if (path.length > 0) {
            onNavigateBack();
          }
        },
        Enter: (): void => {
          e.preventDefault();
          const item = items[focusIndex];
          if (item !== undefined) {
            onSelect(item);
          }
        },
        Escape: (): void => {
          e.preventDefault();
          if (path.length > 0) {
            onNavigateBack();
          } else {
            onClose();
          }
        },
        Backspace: (): void => {
          e.preventDefault();
          if (path.length > 0) {
            onNavigateBack();
          }
        },
      };

      // Space key (same as Enter)
      if (e.key === ' ') {
        const enterHandler = handlers['Enter'];
        if (enterHandler !== undefined) {
          enterHandler();
        }
        return;
      }

      const handler = handlers[e.key];
      if (handler !== undefined) {
        handler();
      }
    },
    [isReady, items, focusIndex, path, onNavigateBack, onClose, onSelect, onSetFocus]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    window.addEventListener('keydown', handleKeyDown);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);
}
