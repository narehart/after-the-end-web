import './Breadcrumb.css';

// links: [{ label: string, onClick?: () => void }]
export default function Breadcrumb({ links }) {
  if (!links || links.length === 0) return null;

  const lastIndex = links.length - 1;
  const hasMultiple = lastIndex > 0;
  const needsCollapse = links.length > 2;
  const first = links[0];
  const last = links[lastIndex];
  const parent = links[lastIndex - 1];

  return (
    <div className="breadcrumb">
      <span className="breadcrumb-segment">
        <button
          className={`breadcrumb-link ${first.onClick ? '' : 'current'}`}
          onClick={first.onClick}
          disabled={!first.onClick}
        >
          {first.label}
        </button>
        {hasMultiple && <span className="breadcrumb-separator">›</span>}
      </span>
      {needsCollapse && (
        <span className="breadcrumb-segment">
          <button className="breadcrumb-link" onClick={parent?.onClick}>...</button>
          <span className="breadcrumb-separator">›</span>
        </span>
      )}
      {hasMultiple && (
        <span className="breadcrumb-segment">
          <button className="breadcrumb-link current" disabled>{last.label}</button>
        </span>
      )}
    </div>
  );
}
