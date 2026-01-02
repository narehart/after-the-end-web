import type { NavigationDirection } from '../types/gamepad';
import { crossedPositiveThreshold } from './crossedPositiveThreshold';
import { crossedNegativeThreshold } from './crossedNegativeThreshold';
import { returnedToCenter } from './returnedToCenter';

export function handleStickAxis(
  value: number,
  lastValue: number,
  posDir: NavigationDirection,
  negDir: NavigationDirection,
  posKey: string,
  negKey: string,
  onNavigate: ((dir: NavigationDirection) => void) | undefined,
  startRepeat: (key: string, action: () => void) => void,
  clearRepeatTimer: (key: string) => void
): void {
  if (crossedPositiveThreshold(value, lastValue)) {
    onNavigate?.(posDir);
    startRepeat(posKey, () => {
      onNavigate?.(posDir);
    });
  } else if (crossedNegativeThreshold(value, lastValue)) {
    onNavigate?.(negDir);
    startRepeat(negKey, () => {
      onNavigate?.(negDir);
    });
  } else if (returnedToCenter(value, lastValue)) {
    clearRepeatTimer(posKey);
    clearRepeatTimer(negKey);
  }
}
