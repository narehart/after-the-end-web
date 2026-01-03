import type { HandleStickAxisProps } from '../types/utils';
import { crossedPositiveThreshold } from './crossedPositiveThreshold';
import { crossedNegativeThreshold } from './crossedNegativeThreshold';
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
