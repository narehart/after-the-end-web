/**
 * Is Space Free
 *
 * Checks if a rectangular area in a grid is free (null or owned by entityId).
 */

interface IsSpaceFreeProps {
  cells: Array<Array<string | null>>;
  x: number;
  y: number;
  width: number;
  height: number;
  entityId: string;
}

export function isSpaceFree(props: IsSpaceFreeProps): boolean {
  const { cells, x, y, width, height, entityId } = props;

  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const row = cells[y + dy];
      const cell = row?.[x + dx];
      if (cell !== null && cell !== entityId) {
        return false;
      }
    }
  }
  return true;
}
