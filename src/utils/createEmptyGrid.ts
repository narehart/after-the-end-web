import type { CreateEmptyGridProps, CreateEmptyGridReturn } from '../types/utils';

export function createEmptyGrid(props: CreateEmptyGridProps): CreateEmptyGridReturn {
  const { width, height } = props;
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}
