import type { ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { BreadcrumbLink } from '../types/inventory';
import type { BorderPosition } from '../types/ui';
import Breadcrumb from './Breadcrumb';
import styles from './Panel.module.css';

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
}: PanelProps): React.JSX.Element {
  const hasHeader = title !== undefined || breadcrumbLinks !== undefined || header !== undefined;

  const renderHeader = (): ReactNode => {
    if (header !== undefined) return header;
    if (breadcrumbLinks !== undefined) {
      return <Breadcrumb links={breadcrumbLinks} icon={breadcrumbIcon} />;
    }
    if (title !== undefined) return <h3 className={cx('panel-title')}>{title}</h3>;
    return null;
  };

  const panelClasses = cx('panel', {
    'panel--border-right': border === 'right',
    'panel--border-left': border === 'left',
    'panel--border-top': border === 'top',
    'panel--border-bottom': border === 'bottom',
  });

  return (
    <div className={className !== undefined ? `${panelClasses} ${className}` : panelClasses}>
      {hasHeader ? <div className={cx('panel-header')}>{renderHeader()}</div> : null}
      <div
        className={
          contentClassName !== undefined
            ? `${cx('panel-content')} ${contentClassName}`
            : cx('panel-content')
        }
      >
        {children}
      </div>
    </div>
  );
}
