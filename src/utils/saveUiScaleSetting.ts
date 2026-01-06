import { SETTINGS_KEY_UI_SCALE } from '../constants/settings';

export function saveUiScaleSetting(scale: number): void {
  localStorage.setItem(SETTINGS_KEY_UI_SCALE, String(scale));
}
