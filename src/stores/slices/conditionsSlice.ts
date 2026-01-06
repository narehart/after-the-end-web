import type { StateCreator } from 'zustand';
import type { ConditionsSlice } from '../../types/ui';
import { INITIAL_CONDITIONS } from '../../constants/conditions';

export const createConditionsSlice: StateCreator<ConditionsSlice, [], [], ConditionsSlice> = (
  set
) => ({
  conditions: INITIAL_CONDITIONS,

  setConditions: (conditions): void => {
    set({ conditions });
  },

  updateCondition: (key, value): void => {
    set((state) => ({
      conditions: { ...state.conditions, [key]: value },
    }));
  },
});
