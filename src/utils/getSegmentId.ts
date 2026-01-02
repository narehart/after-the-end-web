import type { MenuPathSegment } from '../types/inventory';

export function getSegmentId(segment: MenuPathSegment | string): string {
  if (typeof segment === 'string') return segment;
  return segment.id;
}
