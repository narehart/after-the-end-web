/* eslint-disable local/types-in-types-directory -- Util-specific types */
import { FIRST_INDEX, SECOND_INDEX } from '../constants/array';
import { MIN_BREADCRUMB_LINKS } from '../constants/breadcrumb';
import type { BreadcrumbLink } from '../types/inventory';

export interface BreadcrumbSegment {
  key: string;
  label: string;
  onClick?: (() => void) | undefined;
  isCurrent?: boolean;
  showSeparator?: boolean;
}

export function buildSegments(links: BreadcrumbLink[]): BreadcrumbSegment[] {
  const lastIndex = links.length - SECOND_INDEX;
  const first = links[FIRST_INDEX];
  const last = links[lastIndex];
  const parent = links[lastIndex - SECOND_INDEX];
  const segments: BreadcrumbSegment[] = [];

  if (first === undefined || last === undefined) {
    return segments;
  }

  segments.push({
    key: 'first',
    label: first.label,
    onClick: first.onClick,
    isCurrent: lastIndex === FIRST_INDEX,
    showSeparator: lastIndex > FIRST_INDEX,
  });

  if (links.length > MIN_BREADCRUMB_LINKS) {
    segments.push({
      key: 'collapse',
      label: '...',
      onClick: parent?.onClick,
      showSeparator: true,
    });
  }

  if (lastIndex > FIRST_INDEX) {
    segments.push({ key: 'last', label: last.label, isCurrent: true });
  }

  return segments;
}
