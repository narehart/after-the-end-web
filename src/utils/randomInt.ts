import { SECOND_INDEX } from '../constants/array';
import type { RandomIntProps } from '../types/randomContainer';

;

export function randomInt(props: RandomIntProps): number {
  const { min, max } = props;
  return Math.floor(Math.random() * (max - min + SECOND_INDEX)) + min;
}
