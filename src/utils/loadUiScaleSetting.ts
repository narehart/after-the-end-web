import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY_UI_SCALE,
  UI_SCALE_MIN,
  UI_SCALE_MAX,
} from '../constants/settings';

export function loadUiScaleSetting(): number {
  const stored = localStorage.getItem(SETTINGS_KEY_UI_SCALE);
  if (stored === null) {
    return DEFAULT_SETTINGS.uiScale;
  }
  const parsed = parseFloat(stored);
  if (Number.isNaN(parsed)) {
    return DEFAULT_SETTINGS.uiScale;
  }
  if (parsed < UI_SCALE_MIN || parsed > UI_SCALE_MAX) {
    return DEFAULT_SETTINGS.uiScale;
  }
  return parsed;
}
