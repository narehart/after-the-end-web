import './PanelHeader.css';

export default function PanelHeader({ panelIcon, panelLabel, focusPath, onNavigateBack, items, panelType }) {
  // For world panel at ground level, don't show redundant "ground" breadcrumb
  const isGroundRoot = panelType === 'world' && focusPath.length === 1 && focusPath[0] === 'ground';
  const showBreadcrumb = focusPath.length > 0 && !isGroundRoot;

  return (
    <div className="panel-header">
      <span className="panel-icon">{panelIcon}</span>
      <span className="panel-label">{panelLabel}</span>
      {showBreadcrumb && (
        <>
          <span className="breadcrumb-separator">›</span>
          {focusPath.map((containerId, index) => {
            const item = items[containerId];
            const isLast = index === focusPath.length - 1;
            return (
              <span key={containerId} className="breadcrumb-segment">
                <button
                  className={`breadcrumb-link ${isLast ? 'current' : ''}`}
                  onClick={() => onNavigateBack(index)}
                  disabled={isLast}
                >
                  {item?.name || containerId}
                </button>
                {!isLast && <span className="breadcrumb-separator">›</span>}
              </span>
            );
          })}
        </>
      )}
    </div>
  );
}
