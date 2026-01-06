/**
 * useECSInit Hook
 *
 * Initializes the ECS world with inventory data on mount.
 * Should be called once at app startup.
 */

import { useEffect, useRef } from 'react';
import { initialInventoryState } from '../stores/slices/itemsSlice';
import { initializeInventory } from '../ecs/systems/initializeInventorySystem';

export default function useECSInit(): void {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    initializeInventory({
      items: initialInventoryState.items,
      grids: initialInventoryState.grids,
      equipment: initialInventoryState.equipment,
    });
  }, []);
}
