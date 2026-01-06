import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY_VIEWPORT_MODE,
  VALID_VIEWPORT_MODES,
} from '../constants/settings';

export function loadViewportModeSetting(): string {
  const stored = localStorage.getItem(SETTINGS_KEY_VIEWPORT_MODE);
  if (stored === null) {
    return DEFAULT_SETTINGS.viewportMode;
  }
  const isValid = VALID_VIEWPORT_MODES.some((mode) => mode === stored);
  if (isValid) {
    return stored;
  }
  return DEFAULT_SETTINGS.viewportMode;
}
