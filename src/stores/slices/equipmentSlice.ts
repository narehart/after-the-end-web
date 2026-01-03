import type { StateCreator } from 'zustand';
import type { EquipmentSlice } from '../../types/store';
import { initialInventoryState } from './itemsSlice';

export const createEquipmentSlice: StateCreator<EquipmentSlice, [], [], EquipmentSlice> = (
  set
) => ({
  equipment: initialInventoryState.equipment,

  setEquipment: (equipment): void => {
    set({ equipment });
  },

  setEquipmentSlot: (slot, itemId): void => {
    set((state) => ({
      equipment: { ...state.equipment, [slot]: itemId },
    }));
  },
});
