import { useEffect, useRef, useState, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import './DestinationPicker.css';

export default function DestinationPicker({ item, position, onSelect, onClose }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [path, setPath] = useState([]); // Breadcrumb path of container IDs
  const [isReady, setIsReady] = useState(false);
  const pickerRef = useRef(null);

  const equipment = useInventoryStore((state) => state.equipment);
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);
  const findFreePosition = useInventoryStore((state) => state.findFreePosition);

  // Check if item can fit in a container
  const canFitItem = (containerId) => {
    if (!item) return false;
    return findFreePosition(containerId, item.size.width, item.size.height) !== null;
  };

  // Delay accepting keyboard input
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get current container we're viewing
  const currentContainerId = path.length > 0 ? path[path.length - 1] : null;
  const currentContainer = currentContainerId ? items[currentContainerId] : null;
  const currentGrid = currentContainerId ? grids[currentContainerId] : null;

  // Build list of available destinations at current level
  const destinations = [];

  if (path.length === 0) {
    // Root level - show all equipped containers and ground
    destinations.push({
      id: 'ground',
      name: 'Ground',
      type: 'ground',
      isContainer: true,
      canFit: canFitItem('ground'),
    });

    Object.entries(equipment).forEach(([_slotType, itemId]) => {
      if (itemId && itemId !== item?.id) {
        const containerItem = items[itemId];
        if (containerItem?.gridSize) {
          const grid = grids[itemId];
          const usedCells = grid?.cells.flat().filter(Boolean).length || 0;
          const totalCells = containerItem.gridSize.width * containerItem.gridSize.height;

          destinations.push({
            id: itemId,
            name: containerItem.name,
            type: 'container',
            isContainer: true,
            capacity: `${usedCells}/${totalCells}`,
            canFit: canFitItem(itemId),
          });
        }
      }
    });
  } else {
    // Inside a container - show items that are containers + option to place here
    if (currentGrid) {
      // Find unique container items in this grid
      const seenIds = new Set();
      for (let row = 0; row < currentGrid.height; row++) {
        for (let col = 0; col < currentGrid.width; col++) {
          const cellItemId = currentGrid.cells[row][col];
          if (cellItemId && !seenIds.has(cellItemId) && cellItemId !== item?.id) {
            seenIds.add(cellItemId);
            const cellItem = items[cellItemId];
            if (cellItem?.gridSize) {
              const grid = grids[cellItemId];
              const usedCells = grid?.cells.flat().filter(Boolean).length || 0;
              const totalCells = cellItem.gridSize.width * cellItem.gridSize.height;

              destinations.push({
                id: cellItemId,
                name: cellItem.name,
                type: 'container',
                isContainer: true,
                capacity: `${usedCells}/${totalCells}`,
                canFit: canFitItem(cellItemId),
              });
            }
          }
        }
      }
    }
  }

  // Check if current container can fit the item (for "Place here" option)
  const currentCanFit = currentContainerId ? canFitItem(currentContainerId) : false;

  const handleSelect = useCallback((destination) => {
    // Don't allow selecting disabled containers
    if (!destination.canFit) return;

    if (destination.isContainer) {
      // Navigate into container
      setPath((prev) => [...prev, destination.id]);
      setFocusedIndex(0);
    }
  }, []);

  const handlePlaceHere = useCallback(() => {
    // Don't allow placing if item doesn't fit
    if (!currentCanFit) return;

    const targetId = currentContainerId || 'ground';
    onSelect({ id: targetId, name: currentContainer?.name || 'Ground' });
  }, [currentCanFit, currentContainerId, currentContainer?.name, onSelect]);

  const navigateBack = useCallback((index) => {
    if (index < 0) {
      setPath([]);
    } else {
      setPath((prev) => prev.slice(0, index + 1));
    }
    setFocusedIndex(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const hasPlaceHere = path.length > 0;
    const totalItems = destinations.length + (hasPlaceHere ? 1 : 0);

    // Check if an index is disabled
    const isIndexDisabled = (index) => {
      if (hasPlaceHere && index === 0) {
        return !currentCanFit;
      }
      const destIndex = hasPlaceHere ? index - 1 : index;
      return !destinations[destIndex]?.canFit;
    };

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isReady) break;
          // Don't allow selecting disabled items
          if (isIndexDisabled(focusedIndex)) break;
          if (hasPlaceHere && focusedIndex === 0) {
            handlePlaceHere();
          } else {
            const destIndex = hasPlaceHere ? focusedIndex - 1 : focusedIndex;
            handleSelect(destinations[destIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          if (path.length > 0) {
            navigateBack(path.length - 2);
          } else {
            onClose();
          }
          break;
        case 'Backspace':
          e.preventDefault();
          e.stopPropagation();
          if (path.length > 0) {
            navigateBack(path.length - 2);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, destinations, path, isReady, currentCanFit, handlePlaceHere, handleSelect, navigateBack, onClose]);

  // Focus on mount
  useEffect(() => {
    pickerRef.current?.focus();
  }, []);

  return (
    <div
      ref={pickerRef}
      className="destination-modal"
      style={{
        left: position.x,
        top: position.y,
      }}
      tabIndex={-1}
    >
      {/* Breadcrumb - only show when inside a container */}
      {path.length > 0 && (
        <div className="destination-breadcrumb">
          {path.map((containerId, index) => {
            const containerItem = items[containerId];
            const isLast = index === path.length - 1;
            return (
              <span key={containerId} className="breadcrumb-segment">
                {index > 0 && <span className="breadcrumb-sep">›</span>}
                <button
                  className={`breadcrumb-item ${isLast ? 'current' : ''}`}
                  onClick={() => navigateBack(index)}
                >
                  {containerItem?.name || containerId}
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="destination-options">
        {/* Place here option - only show when inside a container */}
        {path.length > 0 && (
          <button
            className={`destination-option place-here ${focusedIndex === 0 ? 'focused' : ''} ${!currentCanFit ? 'disabled' : ''}`}
            onClick={handlePlaceHere}
            onMouseEnter={() => setFocusedIndex(0)}
            disabled={!currentCanFit}
          >
            Place here
          </button>
        )}

        {/* Container destinations */}
        {destinations.map((dest, index) => {
          const itemIndex = path.length > 0 ? index + 1 : index;
          const isDisabled = !dest.canFit;
          return (
          <button
            key={dest.id}
            className={`destination-option ${itemIndex === focusedIndex ? 'focused' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => handleSelect(dest)}
            onMouseEnter={() => setFocusedIndex(itemIndex)}
            disabled={isDisabled}
          >
            <span className="option-label">{dest.name}</span>
            {dest.capacity && (
              <span className="option-capacity">{dest.capacity}</span>
            )}
            <span className="option-arrow">›</span>
          </button>
          );
        })}

        {destinations.length === 0 && path.length > 0 && (
          <div className="no-containers">No containers inside</div>
        )}
      </div>
    </div>
  );
}
