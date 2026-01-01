import { useInventoryStore } from '../stores/inventoryStore';

export default function DestinationBreadcrumb({ path, onNavigateBack }) {
  const items = useInventoryStore((state) => state.items);

  if (path.length === 0) return null;

  return (
    <div className="destination-breadcrumb">
      {path.map((containerId, index) => {
        const containerItem = items[containerId];
        const isLast = index === path.length - 1;
        return (
          <span key={containerId} className="breadcrumb-segment">
            {index > 0 && <span className="breadcrumb-sep">›</span>}
            <button
              className={`breadcrumb-item ${isLast ? 'current' : ''}`}
              onClick={() => onNavigateBack(index)}
            >
              {containerItem?.name || containerId}
            </button>
          </span>
        );
      })}
    </div>
  );
}
