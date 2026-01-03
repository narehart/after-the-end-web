import type { StateCreator } from 'zustand';
import type { Conditions } from '../../types/inventory';
import type { ConditionsSlice } from '../../types/store';

export type { ConditionsSlice } from '../../types/store';

const initialConditions: Conditions = {
  health: 85,
  hunger: 60,
  thirst: 45,
  temperature: 72,
  encumbrance: 35,
};

export const createConditionsSlice: StateCreator<ConditionsSlice, [], [], ConditionsSlice> = (
  set
) => ({
  conditions: initialConditions,

  setConditions: (conditions): void => {
    set({ conditions });
  },

  updateCondition: (key, value): void => {
    set((state) => ({
      conditions: { ...state.conditions, [key]: value },
    }));
  },
});
