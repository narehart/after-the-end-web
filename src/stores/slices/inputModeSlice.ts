import type { StateCreator } from 'zustand';
import type { InputModeSlice } from '../../types/store';

export const createInputModeSlice: StateCreator<InputModeSlice, [], [], InputModeSlice> = (
  set
) => ({
  inputMode: 'pointer',

  setInputMode: (mode): void => {
    set({ inputMode: mode });
  },
});
