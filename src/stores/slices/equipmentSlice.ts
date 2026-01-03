import type { StateCreator } from 'zustand';
import type { EquipmentSlice } from '../../types/store';
import { INITIAL_EQUIPMENT } from '../../constants/equipment';

export type { EquipmentSlice } from '../../types/store';

export const createEquipmentSlice: StateCreator<EquipmentSlice, [], [], EquipmentSlice> = (
  set
) => ({
  equipment: INITIAL_EQUIPMENT,

  setEquipment: (equipment): void => {
    set({ equipment });
  },

  setEquipmentSlot: (slot, itemId): void => {
    set((state) => ({
      equipment: { ...state.equipment, [slot]: itemId },
    }));
  },
});
