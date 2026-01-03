import type { ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { BreadcrumbLink } from '../../types/inventory';
import type { BorderPosition } from '../../types/ui';
import styles from './Panel.module.css';
import { Breadcrumb, Box, Flex, Text } from './index';

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
  emptyMessage,
}: PanelProps): React.JSX.Element {
  const hasHeader = title !== undefined || breadcrumbLinks !== undefined || header !== undefined;
  const isEmpty = children === null || children === undefined;

  const renderHeader = (): ReactNode => {
    if (header !== undefined) return header;
    if (breadcrumbLinks !== undefined) {
      return <Breadcrumb links={breadcrumbLinks} icon={breadcrumbIcon} clipLinks />;
    }
    if (title !== undefined)
      return (
        <Text as="h3" className={cx('panel-title')}>
          {title}
        </Text>
      );
    return null;
  };

  const panelClasses = cx('panel', {
    'panel--border-right': border === 'right',
    'panel--border-left': border === 'left',
    'panel--border-top': border === 'top',
    'panel--border-bottom': border === 'bottom',
  });

  return (
    <Flex
      direction="column"
      className={className !== undefined ? `${panelClasses} ${className}` : panelClasses}
    >
      {hasHeader ? <Box className={cx('panel-header')}>{renderHeader()}</Box> : null}
      <Box
        className={
          contentClassName !== undefined
            ? `${cx('panel-content')} ${contentClassName}`
            : cx('panel-content')
        }
      >
        {isEmpty && emptyMessage !== undefined ? (
          <Box className={cx('empty-message')}>{emptyMessage}</Box>
        ) : (
          children
        )}
      </Box>
    </Flex>
  );
}
