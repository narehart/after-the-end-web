import { STICK_THRESHOLD } from '../constants/gamepad';

export function crossedNegativeThreshold(value: number, lastValue: number): boolean {
  return value < -STICK_THRESHOLD && lastValue >= -STICK_THRESHOLD;
}
