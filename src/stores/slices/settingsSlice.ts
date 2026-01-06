import type { StateCreator } from 'zustand';
import type { PresetKey, SettingsSlice, ViewportMode } from '../../types/settings';
import { DEFAULT_SETTINGS, VALID_VIEWPORT_MODES } from '../../constants/settings';
import { PRESETS } from '../../constants/ui';
import { loadPresetSetting } from '../../utils/loadPresetSetting';
import { loadUiScaleSetting } from '../../utils/loadUiScaleSetting';
import { loadViewportModeSetting } from '../../utils/loadViewportModeSetting';
import { savePresetSetting } from '../../utils/savePresetSetting';
import { saveUiScaleSetting } from '../../utils/saveUiScaleSetting';
import { saveViewportModeSetting } from '../../utils/saveViewportModeSetting';

function isValidPreset(value: string): value is PresetKey {
  return Object.keys(PRESETS).includes(value);
}

function isValidViewportMode(value: string): value is ViewportMode {
  return VALID_VIEWPORT_MODES.some((mode) => mode === value);
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  settingsPreset: DEFAULT_SETTINGS.preset,
  settingsUiScale: DEFAULT_SETTINGS.uiScale,
  settingsViewportMode: DEFAULT_SETTINGS.viewportMode,
  settingsLoaded: false,

  setSettingsPreset: (preset): void => {
    savePresetSetting(preset);
    set({ settingsPreset: preset });
  },

  setSettingsUiScale: (scale): void => {
    saveUiScaleSetting(scale);
    set({ settingsUiScale: scale });
  },

  setSettingsViewportMode: (mode): void => {
    saveViewportModeSetting(mode);
    set({ settingsViewportMode: mode });
  },

  loadSettings: (): void => {
    const presetValue = loadPresetSetting();
    const preset = isValidPreset(presetValue) ? presetValue : DEFAULT_SETTINGS.preset;

    const viewportValue = loadViewportModeSetting();
    const viewportMode = isValidViewportMode(viewportValue)
      ? viewportValue
      : DEFAULT_SETTINGS.viewportMode;

    set({
      settingsPreset: preset,
      settingsUiScale: loadUiScaleSetting(),
      settingsViewportMode: viewportMode,
      settingsLoaded: true,
    });
  },
});
