import type { StateCreator } from 'zustand';
import type { EquipmentSlice } from '../../types/ui';
import { getEquipment } from '../../ecs/queries/inventoryQueries';

export const createEquipmentSlice: StateCreator<EquipmentSlice, [], [], EquipmentSlice> = (
  set
) => ({
  equipment: getEquipment().equipment,

  setEquipment: (equipment): void => {
    set({ equipment });
  },

  setEquipmentSlot: (slot, itemId): void => {
    set((state) => ({
      equipment: { ...state.equipment, [slot]: itemId },
    }));
  },
});
