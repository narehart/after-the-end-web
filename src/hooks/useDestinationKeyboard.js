import { useEffect, useState, useCallback } from 'react';

function createKeyHandlers(params) {
  const {
    totalItems,
    isReady,
    hasPlaceHere,
    focusedIndex,
    isIndexDisabled,
    destinations,
    path,
    setFocusedIndex,
    onPlaceHere,
    onSelect,
    onNavigateBack,
    onClose,
  } = params;

  return {
    ArrowUp: (e) => {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    },
    ArrowDown: (e) => {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    },
    Enter: (e) => {
      e.preventDefault();
      if (!isReady || isIndexDisabled(focusedIndex)) return;
      if (hasPlaceHere && focusedIndex === 0) {
        onPlaceHere();
      } else {
        const destIndex = hasPlaceHere ? focusedIndex - 1 : focusedIndex;
        onSelect(destinations[destIndex]);
      }
    },
    Escape: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (path.length > 0) {
        onNavigateBack(path.length - 2);
      } else {
        onClose();
      }
    },
    Backspace: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (path.length > 0) {
        onNavigateBack(path.length - 2);
      }
    },
  };
}

export default function useDestinationKeyboard({
  destinations,
  path,
  currentCanFit,
  onPlaceHere,
  onSelect,
  onNavigateBack,
  onClose,
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const hasPlaceHere = path.length > 0;
  const totalItems = destinations.length + (hasPlaceHere ? 1 : 0);

  const isIndexDisabled = useCallback((index) => {
    if (hasPlaceHere && index === 0) return !currentCanFit;
    const destIndex = hasPlaceHere ? index - 1 : index;
    return !destinations[destIndex]?.canFit;
  }, [hasPlaceHere, currentCanFit, destinations]);

  useEffect(() => {
    const handlers = createKeyHandlers({
      totalItems,
      isReady,
      hasPlaceHere,
      focusedIndex,
      isIndexDisabled,
      destinations,
      path,
      setFocusedIndex,
      onPlaceHere,
      onSelect,
      onNavigateBack,
      onClose,
    });

    // Space key uses same handler as Enter
    handlers[' '] = handlers.Enter;

    const handleKeyDown = (e) => {
      const handler = handlers[e.key];
      if (handler) handler(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, totalItems, isReady, hasPlaceHere, destinations, path, isIndexDisabled, onPlaceHere, onSelect, onNavigateBack, onClose]);

  const resetFocus = useCallback(() => setFocusedIndex(0), []);

  return { focusedIndex, setFocusedIndex, resetFocus };
}
