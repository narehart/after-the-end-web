import type { HandleStickAxisProps } from '../types/utils';
import { crossedThreshold } from './crossedThreshold';
import { returnedToCenter } from './returnedToCenter';

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
