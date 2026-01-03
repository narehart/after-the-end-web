import type { ReactNode } from 'react';
import type { BreadcrumbLink } from '../types/inventory';
import type { PanelHeaderTypeReturn } from '../types/ui';

export default function getPanelHeaderType(
  header: ReactNode,
  breadcrumbLinks: BreadcrumbLink[] | undefined,
  title: string | undefined
): PanelHeaderTypeReturn {
  if (header !== undefined) return 'custom';
  if (breadcrumbLinks !== undefined) return 'breadcrumb';
  if (title !== undefined) return 'title';
  return 'none';
}
