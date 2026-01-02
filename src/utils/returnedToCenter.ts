import { STICK_THRESHOLD } from '../constants/gamepad';

export function returnedToCenter(value: number, lastValue: number): boolean {
  return Math.abs(value) <= STICK_THRESHOLD && Math.abs(lastValue) > STICK_THRESHOLD;
}
