import type { BreadcrumbLink } from '../types/inventory';
import type { BreadcrumbSegment } from '../types/ui';

export type { BreadcrumbSegment } from '../types/ui';

export function buildSegments(links: BreadcrumbLink[]): BreadcrumbSegment[] {
  const lastIndex = links.length - 1;
  const first = links[0];
  const last = links[lastIndex];
  const parent = links[lastIndex - 1];
  const segments: BreadcrumbSegment[] = [];

  if (first === undefined || last === undefined) {
    return segments;
  }

  segments.push({
    key: 'first',
    label: first.label,
    onClick: first.onClick,
    isCurrent: lastIndex === 0,
    showSeparator: lastIndex > 0,
  });

  if (links.length > 2) {
    segments.push({
      key: 'collapse',
      label: '...',
      onClick: parent?.onClick,
      showSeparator: true,
    });
  }

  if (lastIndex > 0) {
    segments.push({ key: 'last', label: last.label, isCurrent: true });
  }

  return segments;
}
