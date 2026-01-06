import type { NavigationDirection } from '../types/gamepad';
import { crossedThreshold } from './crossedThreshold';
import { returnedToCenter } from './returnedToCenter';

interface HandleStickAxisProps {
  value: number;
  lastValue: number;
  posDir: NavigationDirection;
  negDir: NavigationDirection;
  posKey: string;
  negKey: string;
  onNavigate: ((dir: NavigationDirection) => void) | undefined;
  startRepeat: (key: string, action: () => void) => void;
  clearRepeatTimer: (key: string) => void;
}

export function handleStickAxis(props: HandleStickAxisProps): void {
  const {
    value,
    lastValue,
    posDir,
    negDir,
    posKey,
    negKey,
    onNavigate,
    startRepeat,
    clearRepeatTimer,
  } = props;
  if (crossedThreshold({ value, lastValue, direction: 'positive' })) {
    onNavigate?.(posDir);
    startRepeat(posKey, () => {
      onNavigate?.(posDir);
    });
  } else if (crossedThreshold({ value, lastValue, direction: 'negative' })) {
    onNavigate?.(negDir);
    startRepeat(negKey, () => {
      onNavigate?.(negDir);
    });
  } else if (returnedToCenter(value, lastValue)) {
    clearRepeatTimer(posKey);
    clearRepeatTimer(negKey);
  }
}
