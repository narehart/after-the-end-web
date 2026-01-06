import type { DisplayInfo } from '../types/ui';
import { getAspectRatioLabel } from './getAspectRatioLabel';

type GetBrowserDisplayInfoReturn = DisplayInfo;

export function getBrowserDisplayInfo(): GetBrowserDisplayInfoReturn {
  const width = window.screen.width * window.devicePixelRatio;
  const height = window.screen.height * window.devicePixelRatio;

  return {
    width,
    height,
    scaleFactor: window.devicePixelRatio,
    aspectRatio: width / height,
    aspectRatioLabel: getAspectRatioLabel(width, height),
    name: null,
    source: 'browser',
  };
}
