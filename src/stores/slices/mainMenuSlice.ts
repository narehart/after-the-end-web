import type { StateCreator } from 'zustand';
import type { MainMenuSlice, ScreenId } from '../../types/ui';

export const createMainMenuSlice: StateCreator<MainMenuSlice, [], [], MainMenuSlice> = (set) => ({
  activeScreen: 'inventory',
  isMainMenuOpen: false,

  setActiveScreen: (screen: ScreenId): void => {
    set({ activeScreen: screen, isMainMenuOpen: false });
  },

  toggleMainMenu: (): void => {
    set((state) => ({ isMainMenuOpen: !state.isMainMenuOpen }));
  },

  openMainMenu: (): void => {
    set({ isMainMenuOpen: true });
  },

  closeMainMenu: (): void => {
    set({ isMainMenuOpen: false });
  },
});
