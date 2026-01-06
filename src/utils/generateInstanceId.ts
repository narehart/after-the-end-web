import { ID_RADIX, ID_SLICE_START, ID_SLICE_END } from '../constants/ids';

;

export function generateInstanceId(neoId: string): string {
  const suffix = Math.random().toString(ID_RADIX).slice(ID_SLICE_START, ID_SLICE_END);
  return `${neoId}_${suffix}`;
}
