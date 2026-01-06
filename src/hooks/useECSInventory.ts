/**
 * useECSInventory Hook
 *
 * Bridges ECS inventory state to React components.
 * Provides queries and actions for inventory management.
 */

import { useMemo, useCallback } from 'react';
import { useEntities } from 'miniplex-react';
import { world } from '../ecs/world';
import type { Entity, EntityId, GridId } from '../types/ecs';
import type { GridCell, GridsMap, ItemsMap } from '../types/inventory';
import { moveItem } from '../ecs/systems/moveItemSystem';
import { splitItem } from '../ecs/systems/splitItemSystem';
import { destroyItem } from '../ecs/systems/destroyItemSystem';
import { mergeItems } from '../ecs/systems/mergeItemsSystem';
import { placeItem } from '../ecs/systems/placeItemSystem';

// Query archetypes
const itemsQuery = world.with('item', 'template');
const gridsQuery = world.with('grid');

interface UseECSInventoryReturn {
  // Queries - raw entities
  items: Entity[];
  grids: Entity[];
  getItem: (entityId: EntityId) => Entity | undefined;
  getGrid: (gridId: GridId) => Entity | undefined;
  getItemsInGrid: (gridId: GridId) => Entity[];

  // Zustand-compatible maps for migration
  itemsMap: ItemsMap;
  gridsMap: GridsMap;

  // Actions
  moveItem: (entityId: EntityId, targetGridId: GridId) => boolean;
  splitItem: (entityId: EntityId, targetGridId: GridId) => boolean;
  destroyItem: (entityId: EntityId) => boolean;
  mergeItems: (sourceEntityId: EntityId, targetEntityId: EntityId) => boolean;
  placeItem: (entityId: EntityId, gridId: GridId, x: number, y: number) => boolean;
}

export default function useECSInventory(): UseECSInventoryReturn {
  // Subscribe to entity changes
  const { entities: items } = useEntities(itemsQuery);
  const { entities: grids } = useEntities(gridsQuery);

  // Query helpers
  const getItem = useCallback(
    (entityId: EntityId): Entity | undefined => {
      return items.find((e) => e.id === entityId);
    },
    [items]
  );

  const getGrid = useCallback(
    (gridId: GridId): Entity | undefined => {
      return grids.find((e) => e.grid.gridId === gridId);
    },
    [grids]
  );

  const getItemsInGrid = useCallback(
    (gridId: GridId): Entity[] => {
      return items.filter((e) => e.position?.gridId === gridId);
    },
    [items]
  );

  // Wrapped actions that trigger re-renders
  const handleMoveItem = useCallback((entityId: EntityId, targetGridId: GridId): boolean => {
    const result = moveItem({ entityId, targetGridId });
    return result.success;
  }, []);

  const handleSplitItem = useCallback((entityId: EntityId, targetGridId: GridId): boolean => {
    const result = splitItem({ entityId, targetGridId });
    return result.success;
  }, []);

  const handleDestroyItem = useCallback((entityId: EntityId): boolean => {
    return destroyItem({ entityId });
  }, []);

  const handleMergeItems = useCallback(
    (sourceEntityId: EntityId, targetEntityId: EntityId): boolean => {
      return mergeItems({ sourceEntityId, targetEntityId });
    },
    []
  );

  const handlePlaceItem = useCallback(
    (entityId: EntityId, gridId: GridId, x: number, y: number): boolean => {
      return placeItem({ entityId, gridId, x, y });
    },
    []
  );

  // Zustand-compatible maps for migration
  const itemsMap = useMemo((): ItemsMap => {
    const map: ItemsMap = {};
    for (const entity of items) {
      const entityId = entity.id;
      if (entityId !== undefined) map[entityId] = entity.template.template;
    }
    return map;
  }, [items]);

  const gridsMap = useMemo((): GridsMap => {
    const map: GridsMap = {};
    for (const entity of grids) {
      const gridCell: GridCell = {
        cells: entity.grid.cells,
        width: entity.grid.width,
        height: entity.grid.height,
      };
      map[entity.grid.gridId] = gridCell;
    }
    return map;
  }, [grids]);

  return useMemo(
    () => ({
      items,
      grids,
      getItem,
      getGrid,
      getItemsInGrid,
      itemsMap,
      gridsMap,
      moveItem: handleMoveItem,
      splitItem: handleSplitItem,
      destroyItem: handleDestroyItem,
      mergeItems: handleMergeItems,
      placeItem: handlePlaceItem,
    }),
    [
      items,
      grids,
      getItem,
      getGrid,
      getItemsInGrid,
      itemsMap,
      gridsMap,
      handleMoveItem,
      handleSplitItem,
      handleDestroyItem,
      handleMergeItems,
      handlePlaceItem,
    ]
  );
}
