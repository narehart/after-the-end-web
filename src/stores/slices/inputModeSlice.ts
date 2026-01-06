import type { StateCreator } from 'zustand';
import type { InputModeSlice } from '../../types/ui';

export const createInputModeSlice: StateCreator<InputModeSlice, [], [], InputModeSlice> = (
  set
) => ({
  inputMode: 'pointer',

  setInputMode: (mode): void => {
    set({ inputMode: mode });
  },
});
