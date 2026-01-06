import { SETTINGS_KEY_PRESET } from '../constants/settings';

export function savePresetSetting(preset: string): void {
  localStorage.setItem(SETTINGS_KEY_PRESET, preset);
}
