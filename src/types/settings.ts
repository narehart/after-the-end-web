import type { PRESETS } from '../constants/ui';

export type PresetKey = keyof typeof PRESETS;

export type ViewportMode = 'scale-to-fill' | 'letterbox';

export interface Settings {
  preset: PresetKey;
  uiScale: number;
  viewportMode: ViewportMode;
}

// Settings Slice for Zustand
interface SettingsState {
  settingsPreset: PresetKey;
  settingsUiScale: number;
  settingsViewportMode: ViewportMode;
  settingsLoaded: boolean;
}

interface SettingsActions {
  setSettingsPreset: (preset: PresetKey) => void;
  setSettingsUiScale: (scale: number) => void;
  setSettingsViewportMode: (mode: ViewportMode) => void;
  loadSettings: () => void;
}

export type SettingsSlice = SettingsState & SettingsActions;
