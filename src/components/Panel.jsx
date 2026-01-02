import Breadcrumb from './Breadcrumb';
import './Panel.css';

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
    if (title) return <h3 className="panel-title">{title}</h3>;
    return null;
  };

  return (
    <div className={`panel ${border ? `panel--border-${border}` : ''} ${className || ''}`}>
      {hasHeader && <div className="panel-header">{renderHeader()}</div>}
      <div className={`panel-content ${contentClassName || ''}`}>
        {children}
      </div>
    </div>
  );
}
