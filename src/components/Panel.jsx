import classNames from 'classnames/bind';
import Breadcrumb from './Breadcrumb';
import styles from './Panel.module.css';

const cx = classNames.bind(styles);

export default function Panel({
  title,
  breadcrumbLinks,
  breadcrumbIcon,
  header,
  children,
  className,
  border,
  contentClassName,
}) {
  const hasHeader = title || breadcrumbLinks || header;

  const renderHeader = () => {
    if (header) return header;
    if (breadcrumbLinks) return <Breadcrumb links={breadcrumbLinks} icon={breadcrumbIcon} />;
    if (title) return <h3 className={cx('panel-title')}>{title}</h3>;
    return null;
  };

  const panelClasses = cx('panel', {
    'panel--border-right': border === 'right',
    'panel--border-left': border === 'left',
    'panel--border-top': border === 'top',
    'panel--border-bottom': border === 'bottom',
  });

  return (
    <div className={className ? `${panelClasses} ${className}` : panelClasses}>
      {hasHeader && <div className={cx('panel-header')}>{renderHeader()}</div>}
      <div
        className={
          contentClassName ? `${cx('panel-content')} ${contentClassName}` : cx('panel-content')
        }
      >
        {children}
      </div>
    </div>
  );
}
