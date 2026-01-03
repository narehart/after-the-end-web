import classNames from 'classnames/bind';
import type { BreadcrumbLink } from '../types/inventory';
import type { LinkWithIcon } from '../types/ui';
import { buildSegments } from '../utils/breadcrumb';
import styles from './Breadcrumb.module.css';

const cx = classNames.bind(styles);

interface BreadcrumbProps {
  links: BreadcrumbLink[];
  icon?: string | undefined;
  clipLinks?: boolean | undefined;
}

export default function Breadcrumb({
  links,
  icon,
  clipLinks,
}: BreadcrumbProps): React.JSX.Element | null {
  if (links.length === 0) return null;

  const firstLink: LinkWithIcon | undefined = links[0];
  const displayIcon = firstLink?.icon ?? icon;
  const segments = buildSegments(links);

  return (
    <div className={cx('breadcrumb', { 'breadcrumb--clip': clipLinks === true })}>
      {displayIcon !== undefined ? (
        <img src={displayIcon} alt="" className={cx('breadcrumb-icon')} />
      ) : null}
      {segments.map((seg) => (
        <span key={seg.key} className={cx('breadcrumb-segment')}>
          <button
            className={cx('breadcrumb-link', { current: seg.isCurrent === true })}
            onClick={seg.onClick}
            disabled={seg.isCurrent === true || seg.onClick === undefined}
          >
            {seg.label}
          </button>
          {seg.showSeparator === true ? (
            <span className={cx('breadcrumb-separator')}>›</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
