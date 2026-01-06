import { DEFAULT_SETTINGS, SETTINGS_KEY_PRESET } from '../constants/settings';
import { PRESETS } from '../constants/ui';

export function loadPresetSetting(): string {
  const stored = localStorage.getItem(SETTINGS_KEY_PRESET);
  if (stored === null) {
    return DEFAULT_SETTINGS.preset;
  }
  const validKeys = Object.keys(PRESETS);
  if (validKeys.includes(stored)) {
    return stored;
  }
  return DEFAULT_SETTINGS.preset;
}
