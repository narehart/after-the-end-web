import type { CellGrid } from '../types/inventory';

interface CreateEmptyGridProps {
  width: number;
  height: number;
}

type CreateEmptyGridReturn = CellGrid;

export function createEmptyGrid(props: CreateEmptyGridProps): CreateEmptyGridReturn {
  const { width, height } = props;
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}
