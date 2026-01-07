import { VIEWPORT_WIDTH, VIEWPORT_HEIGHT } from '../constants/ui';
import { isTauri } from './isTauri';

/**
 * Sets the minimum inner size for the Tauri window.
 * Uses the inner size API which excludes window decorations (title bar, borders).
 * This ensures the content area is never smaller than the UI requires,
 * regardless of OS-specific window chrome dimensions.
 */
export async function setTauriWindowConstraints(): Promise<void> {
  if (!isTauri()) {
    return;
  }

  try {
    const { getCurrentWindow, LogicalSize } = await import('@tauri-apps/api/window');
    const appWindow = getCurrentWindow();

    // Set minimum inner size to match our viewport requirements
    // This is the content area, excluding window decorations
    await appWindow.setMinSize(new LogicalSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT));
  } catch {
    // Silently fail if Tauri APIs unavailable
  }
}
