import type { DisplayInfo } from '../types/ui';
import { getAspectRatioLabel } from './getAspectRatioLabel';

type GetTauriDisplayInfoReturn = DisplayInfo | null;

export async function getTauriDisplayInfo(): Promise<GetTauriDisplayInfoReturn> {
  try {
    const { currentMonitor } = await import('@tauri-apps/api/window');
    const monitor = await currentMonitor();

    if (monitor === null) {
      return null;
    }

    const width = monitor.size.width;
    const height = monitor.size.height;

    return {
      width,
      height,
      scaleFactor: monitor.scaleFactor,
      aspectRatio: width / height,
      aspectRatioLabel: getAspectRatioLabel(width, height),
      name: monitor.name,
      source: 'tauri',
    };
  } catch {
    return null;
  }
}
