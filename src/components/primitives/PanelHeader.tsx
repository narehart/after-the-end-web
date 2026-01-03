import type { BreadcrumbLink } from '../../types/inventory';
import type { PanelHeaderTypeReturn } from '../../types/ui';
import { Breadcrumb, Flex } from './index';

interface PanelHeaderProps {
  headerType: PanelHeaderTypeReturn;
  header: React.ReactNode;
  breadcrumbLinks: BreadcrumbLink[] | undefined;
  breadcrumbIcon: string | undefined;
  title: string | undefined;
  titleClassName: string;
}

export default function PanelHeader({
  headerType,
  header,
  breadcrumbLinks,
  breadcrumbIcon,
  title,
  titleClassName,
}: PanelHeaderProps): React.JSX.Element | null {
  switch (headerType) {
    case 'custom':
      return <>{header}</>;
    case 'breadcrumb':
      return <Breadcrumb links={breadcrumbLinks ?? []} icon={breadcrumbIcon} clipLinks />;
    case 'title':
      return (
        <Flex as="h3" align="center" className={titleClassName}>
          {title}
        </Flex>
      );
    case 'none':
      return null;
  }
}
