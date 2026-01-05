import type { BreadcrumbLink } from '../types/inventory';
import type { PanelHeaderTypeReturn } from '../types/ui';
import { Breadcrumb } from './index';

interface PanelHeaderProps {
  headerType: PanelHeaderTypeReturn;
  header: React.ReactNode;
  breadcrumbLinks: BreadcrumbLink[] | undefined;
  breadcrumbIcon: string | undefined;
  title: string | undefined;
}

export default function PanelHeader({
  headerType,
  header,
  breadcrumbLinks,
  breadcrumbIcon,
  title,
}: PanelHeaderProps): React.JSX.Element | null {
  switch (headerType) {
    case 'custom':
      return <>{header}</>;
    case 'breadcrumb':
      return <Breadcrumb links={breadcrumbLinks ?? []} icon={breadcrumbIcon} clipLinks />;
    case 'title': {
      const titleLink: BreadcrumbLink = { label: title ?? '' };
      return <Breadcrumb links={[titleLink]} clipLinks />;
    }
    case 'none':
      return null;
  }
}
