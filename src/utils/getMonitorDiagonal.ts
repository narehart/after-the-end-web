import { KNOWN_DISPLAYS } from '../constants/ui';
import { estimateDiagonal } from './estimateDiagonal';

export function getMonitorDiagonal(): number {
  const dpr = window.devicePixelRatio;
  const physicalWidth = window.screen.width * dpr;
  const physicalHeight = window.screen.height * dpr;
  const key = `${String(physicalWidth)}x${String(physicalHeight)}`;

  return KNOWN_DISPLAYS[key] ?? estimateDiagonal(physicalWidth, physicalHeight, dpr);
}
