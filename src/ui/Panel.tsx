import type { ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { BreadcrumbLink } from '../types/inventory';
import type { BorderPosition, FlexAlign, FlexDirection, FlexGap, FlexJustify } from '../types/ui';
import buildPanelClasses from '../utils/buildPanelClasses';
import buildPanelHeaderClasses from '../utils/buildPanelHeaderClasses';
import getPanelHeaderType from '../utils/getPanelHeaderType';
import styles from './Panel.module.css';
import PanelHeader from './PanelHeader';
import { Box, EmptyState, Flex } from './index';

const cx = classNames.bind(styles);

interface PanelProps {
  title?: string;
  breadcrumbLinks?: BreadcrumbLink[];
  breadcrumbIcon?: string;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  border?: BorderPosition;
  contentClassName?: string;
  contentDirection?: FlexDirection | undefined;
  contentJustify?: FlexJustify | undefined;
  contentAlign?: FlexAlign | undefined;
  contentGap?: FlexGap | undefined;
  emptyMessage?: string;
}

export default function Panel({
  title,
  breadcrumbLinks,
  breadcrumbIcon,
  header,
  children,
  className,
  border,
  contentClassName,
  contentDirection,
  contentJustify,
  contentAlign,
  contentGap,
  emptyMessage,
}: PanelProps): React.JSX.Element {
  const headerType = getPanelHeaderType(header, breadcrumbLinks, title);
  const isEmpty = children === null || children === undefined;
  const useFlexContent =
    contentDirection !== undefined ||
    contentJustify !== undefined ||
    contentAlign !== undefined ||
    contentGap !== undefined;

  const panelClasses = buildPanelClasses(cx, border, className);
  const contentClasses =
    contentClassName !== undefined
      ? `${cx('panel-content')} ${contentClassName}`
      : cx('panel-content');

  const contentChildren =
    isEmpty && emptyMessage !== undefined ? <EmptyState message={emptyMessage} /> : children;

  const headerClasses = buildPanelHeaderClasses(cx, headerType);

  return (
    <Flex direction="column" className={panelClasses}>
      {headerType !== 'none' ? (
        <Box className={headerClasses}>
          <PanelHeader
            headerType={headerType}
            header={header}
            breadcrumbLinks={breadcrumbLinks}
            breadcrumbIcon={breadcrumbIcon}
            title={title}
          />
        </Box>
      ) : null}
      {useFlexContent ? (
        <Flex
          direction={contentDirection}
          justify={contentJustify}
          align={contentAlign}
          gap={contentGap}
          className={contentClasses}
        >
          {contentChildren}
        </Flex>
      ) : (
        <Box className={contentClasses}>{contentChildren}</Box>
      )}
    </Flex>
  );
}
