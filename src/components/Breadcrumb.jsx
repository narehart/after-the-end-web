import classNames from 'classnames/bind';
import styles from './Breadcrumb.module.css';

const cx = classNames.bind(styles);

function buildSegments(links) {
  const lastIndex = links.length - 1;
  const first = links[0];
  const last = links[lastIndex];
  const parent = links[lastIndex - 1];
  const segments = [];

  // First segment
  segments.push({
    key: 'first',
    label: first.label,
    onClick: first.onClick,
    isCurrent: lastIndex === 0,
    showSeparator: lastIndex > 0,
  });

  // Collapse segment (for 3+ links)
  if (links.length > 2) {
    segments.push({ key: 'collapse', label: '...', onClick: parent?.onClick, showSeparator: true });
  }

  // Last segment
  if (lastIndex > 0) {
    segments.push({ key: 'last', label: last.label, isCurrent: true });
  }

  return segments;
}

// links: [{ label: string, onClick?: () => void, icon?: string }]
// icon: optional image src to display at the start (overridden by first link's icon)
// clipLinks: if true, applies max-width clipping from CSS variable
export default function Breadcrumb({ links, icon, clipLinks }) {
  if (!links || links.length === 0) return null;

  const displayIcon = links[0].icon || icon;
  const segments = buildSegments(links);

  return (
    <div className={cx('breadcrumb', { 'breadcrumb--clip': clipLinks })}>
      {displayIcon && <img src={displayIcon} alt="" className={cx('breadcrumb-icon')} />}
      {segments.map((seg) => (
        <span key={seg.key} className={cx('breadcrumb-segment')}>
          <button
            className={cx('breadcrumb-link', { 'current': seg.isCurrent })}
            onClick={seg.onClick}
            disabled={seg.isCurrent || !seg.onClick}
          >
            {seg.label}
          </button>
          {seg.showSeparator && <span className={cx('breadcrumb-separator')}>›</span>}
        </span>
      ))}
    </div>
  );
}
