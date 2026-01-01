import { useInventoryStore } from '../stores/inventoryStore';
import './GridPanelBreadcrumb.css';

export default function GridPanelBreadcrumb() {
  const focusPath = useInventoryStore((state) => state.focusPath);
  const items = useInventoryStore((state) => state.items);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  return (
    <div className="breadcrumb">
      {focusPath.map((containerId, index) => {
        const item = items[containerId];
        const isLast = index === focusPath.length - 1;
        return (
          <span key={containerId} className="breadcrumb-segment">
            <button
              className={`breadcrumb-link ${isLast ? 'current' : ''}`}
              onClick={() => navigateBack(index)}
              disabled={isLast}
            >
              {item?.name || containerId}
            </button>
            {!isLast && <span className="breadcrumb-separator">›</span>}
          </span>
        );
      })}
    </div>
  );
}
