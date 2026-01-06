import type { Settings, ViewportMode } from '../types/settings';

export const DEFAULT_SETTINGS: Settings = {
  preset: 'steam-deck',
  uiScale: 1,
  viewportMode: 'letterbox',
};

export const SETTINGS_KEY_PRESET = 'ate-settings-preset';
export const SETTINGS_KEY_UI_SCALE = 'ate-settings-ui-scale';
export const SETTINGS_KEY_VIEWPORT_MODE = 'ate-settings-viewport-mode';

export const VALID_VIEWPORT_MODES: readonly ViewportMode[] = ['scale-to-fill', 'letterbox'];

export const UI_SCALE_MIN = 0.5;
export const UI_SCALE_MAX = 2;
