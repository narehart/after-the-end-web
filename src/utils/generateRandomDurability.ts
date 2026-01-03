import { MAX_DURABILITY, MIN_DURABILITY } from '../constants/numbers';

export function generateRandomDurability(): number {
  return (
    Math.floor(Math.random() * (MAX_DURABILITY - MIN_DURABILITY + MIN_DURABILITY)) + MIN_DURABILITY
  );
}
