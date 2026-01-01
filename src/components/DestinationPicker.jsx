import { useEffect, useRef, useState, useCallback } from 'react';
import useDestinations from '../hooks/useDestinations';
import useDestinationKeyboard from '../hooks/useDestinationKeyboard';
import DestinationBreadcrumb from './DestinationBreadcrumb';
import DestinationOptions from './DestinationOptions';
import './DestinationPicker.css';

export default function DestinationPicker({ item, position, onSelect, onClose }) {
  const [path, setPath] = useState([]);
  const pickerRef = useRef(null);

  const { destinations, currentContainerId, currentContainer, currentCanFit } = useDestinations(item, path);

  const handleSelect = useCallback((destination) => {
    if (!destination.canFit) return;
    if (destination.isContainer) {
      setPath((prev) => [...prev, destination.id]);
    }
  }, []);

  const handlePlaceHere = useCallback(() => {
    if (!currentCanFit) return;
    const targetId = currentContainerId || 'ground';
    onSelect({ id: targetId, name: currentContainer?.name || 'Ground' });
  }, [currentCanFit, currentContainerId, currentContainer?.name, onSelect]);

  const navigateBack = useCallback((index) => {
    setPath(index < 0 ? [] : (prev) => prev.slice(0, index + 1));
  }, []);

  const { focusedIndex, setFocusedIndex, resetFocus } = useDestinationKeyboard({
    destinations,
    path,
    currentCanFit,
    onPlaceHere: handlePlaceHere,
    onSelect: handleSelect,
    onNavigateBack: navigateBack,
    onClose,
  });

  // Reset focus when navigating
  useEffect(() => {
    resetFocus();
  }, [path, resetFocus]);

  // Focus on mount
  useEffect(() => {
    pickerRef.current?.focus();
  }, []);

  return (
    <div
      ref={pickerRef}
      className="destination-modal"
      style={{ left: position.x, top: position.y }}
      tabIndex={-1}
    >
      <DestinationBreadcrumb path={path} onNavigateBack={navigateBack} />
      <DestinationOptions
        destinations={destinations}
        path={path}
        currentCanFit={currentCanFit}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        onPlaceHere={handlePlaceHere}
        onSelect={handleSelect}
      />
    </div>
  );
}
