import classNames from 'classnames/bind';
import type { BreadcrumbLink } from '../types/inventory';
import styles from './Breadcrumb.module.css';

const cx = classNames.bind(styles);

interface BreadcrumbSegment {
  key: string;
  label: string;
  onClick?: (() => void) | undefined;
  isCurrent?: boolean;
  showSeparator?: boolean;
}

function buildSegments(links: BreadcrumbLink[]): BreadcrumbSegment[] {
  const lastIndex = links.length - 1;
  const first = links[0];
  const last = links[lastIndex];
  const parent = links[lastIndex - 1];
  const segments: BreadcrumbSegment[] = [];

  if (first === undefined || last === undefined) {
    return segments;
  }

  segments.push({
    key: 'first',
    label: first.label,
    onClick: first.onClick,
    isCurrent: lastIndex === 0,
    showSeparator: lastIndex > 0,
  });

  if (links.length > 2) {
    segments.push({
      key: 'collapse',
      label: '...',
      onClick: parent?.onClick,
      showSeparator: true,
    });
  }

  if (lastIndex > 0) {
    segments.push({ key: 'last', label: last.label, isCurrent: true });
  }

  return segments;
}

interface BreadcrumbProps {
  links: BreadcrumbLink[];
  icon?: string | undefined;
  clipLinks?: boolean | undefined;
}

interface LinkWithIcon extends BreadcrumbLink {
  icon?: string;
}

export default function Breadcrumb({
  links,
  icon,
  clipLinks,
}: BreadcrumbProps): React.JSX.Element | null {
  if (links.length === 0) return null;

  const firstLink = links[0] as LinkWithIcon | undefined;
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
