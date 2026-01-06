import { STICK_THRESHOLD } from '../constants/gamepad';
import type { ThresholdDirection } from '../types/gamepad';

interface CrossedThresholdProps {
  value: number;
  lastValue: number;
  direction: ThresholdDirection;
}

type CrossedThresholdReturn = boolean;

export function crossedThreshold(props: CrossedThresholdProps): CrossedThresholdReturn {
  const { value, lastValue, direction } = props;
  if (direction === 'positive') {
    return value > STICK_THRESHOLD && lastValue <= STICK_THRESHOLD;
  }
  return value < -STICK_THRESHOLD && lastValue >= -STICK_THRESHOLD;
}
