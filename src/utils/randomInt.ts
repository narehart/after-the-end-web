import { SECOND_INDEX } from '../constants/primitives';

interface RandomIntProps {
  min: number;
  max: number;
}

export function randomInt(props: RandomIntProps): number {
  const { min, max } = props;
  return Math.floor(Math.random() * (max - min + SECOND_INDEX)) + min;
}
