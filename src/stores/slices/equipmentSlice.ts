import type { StateCreator } from 'zustand';
import type { SlotType, Equipment } from '../../types/inventory';

export interface EquipmentState {
  equipment: Equipment;
}

export interface EquipmentActions {
  setEquipment: (equipment: Equipment) => void;
  setEquipmentSlot: (slot: SlotType, itemId: string | null) => void;
}

export type EquipmentSlice = EquipmentState & EquipmentActions;

const initialEquipment: Equipment = {
  helmet: null,
  eyes: 'glasses-1',
  face: null,
  neck: null,
  backpack: 'backpack-1',
  coat: null,
  vest: null,
  shirt: null,
  rightShoulder: null,
  leftShoulder: null,
  rightGlove: null,
  leftGlove: null,
  rightRing: null,
  leftRing: null,
  rightHolding: null,
  leftHolding: null,
  pouch: 'pouch-1',
  pants: null,
  rightShoe: null,
  leftShoe: null,
};

export const createEquipmentSlice: StateCreator<EquipmentSlice, [], [], EquipmentSlice> = (
  set
) => ({
  equipment: initialEquipment,

  setEquipment: (equipment): void => {
    set({ equipment });
  },

  setEquipmentSlot: (slot, itemId): void => {
    set((state) => ({
      equipment: { ...state.equipment, [slot]: itemId },
    }));
  },
});
