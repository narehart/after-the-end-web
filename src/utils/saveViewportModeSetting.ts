import { SETTINGS_KEY_VIEWPORT_MODE } from '../constants/settings';

export function saveViewportModeSetting(mode: string): void {
  localStorage.setItem(SETTINGS_KEY_VIEWPORT_MODE, mode);
}
