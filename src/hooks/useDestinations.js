import { useMemo, useCallback } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';

function getContainerInfo(items, grids, containerId) {
  const containerItem = items[containerId];
  if (!containerItem?.gridSize) return null;

  const grid = grids[containerId];
  const usedCells = grid?.cells.flat().filter(Boolean).length || 0;
  const totalCells = containerItem.gridSize.width * containerItem.gridSize.height;

  return {
    id: containerId,
    name: containerItem.name,
    type: 'container',
    isContainer: true,
    capacity: `${usedCells}/${totalCells}`,
  };
}

export default function useDestinations(item, path) {
  const equipment = useInventoryStore((state) => state.equipment);
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);
  const findFreePosition = useInventoryStore((state) => state.findFreePosition);

  const canFitItem = useCallback((containerId) => {
    if (!item) return false;
    return findFreePosition(containerId, item.size.width, item.size.height) !== null;
  }, [item, findFreePosition]);

  const currentContainerId = path.length > 0 ? path[path.length - 1] : null;
  const currentContainer = currentContainerId ? items[currentContainerId] : null;
  const currentGrid = currentContainerId ? grids[currentContainerId] : null;
  const currentCanFit = currentContainerId ? canFitItem(currentContainerId) : false;

  const destinations = useMemo(() => {
    const result = [];

    if (path.length === 0) {
      // Root level - show ground and equipped containers
      result.push({
        id: 'ground',
        name: 'Ground',
        type: 'ground',
        isContainer: true,
        canFit: canFitItem('ground'),
      });

      Object.entries(equipment).forEach(([_slotType, itemId]) => {
        if (itemId && itemId !== item?.id) {
          const info = getContainerInfo(items, grids, itemId);
          if (info) {
            result.push({ ...info, canFit: canFitItem(itemId) });
          }
        }
      });
    } else if (currentGrid) {
      // Inside a container - show nested containers
      const seenIds = new Set();
      for (let row = 0; row < currentGrid.height; row++) {
        for (let col = 0; col < currentGrid.width; col++) {
          const cellItemId = currentGrid.cells[row][col];
          if (cellItemId && !seenIds.has(cellItemId) && cellItemId !== item?.id) {
            seenIds.add(cellItemId);
            const info = getContainerInfo(items, grids, cellItemId);
            if (info) {
              result.push({ ...info, canFit: canFitItem(cellItemId) });
            }
          }
        }
      }
    }

    return result;
  }, [path, equipment, items, grids, item, currentGrid, canFitItem]);

  return {
    destinations,
    currentContainerId,
    currentContainer,
    currentCanFit,
  };
}
