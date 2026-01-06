import { FIRST_INDEX, SECOND_INDEX } from '../constants/primitives';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - SECOND_INDEX; i > FIRST_INDEX; i--) {
    const j = Math.floor(Math.random() * (i + SECOND_INDEX));
    const temp = shuffled[i];
    const swapItem = shuffled[j];
    if (temp !== undefined && swapItem !== undefined) {
      shuffled[i] = swapItem;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}
