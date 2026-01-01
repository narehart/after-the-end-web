import { useInventoryStore } from '../stores/inventoryStore';
import PanelHeader from './PanelHeader';
import ItemGrid from './ItemGrid';
import './ContainerView.css';

// Main ContainerView component - reusable for both inventory and world panels
export default function ContainerView({
  focusPath,
  onNavigateBack,
  emptyMessage = 'No container selected',
  panelType = 'inventory', // 'inventory' | 'world'
  panelIcon = '📦',
  panelLabel = 'Container',
  cellSize = 32
}) {
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);

  const currentContainerId = focusPath.length > 0 ? focusPath[focusPath.length - 1] : null;
  const currentGrid = currentContainerId ? grids[currentContainerId] : null;

  // Determine context for action modal based on panel type and current container
  const getContext = () => {
    if (panelType === 'world') {
      return currentContainerId === 'ground' ? 'ground' : 'world';
    }
    return 'grid';
  };

  return (
    <div className="container-view">
      <PanelHeader
        panelIcon={panelIcon}
        panelLabel={panelLabel}
        focusPath={focusPath}
        onNavigateBack={onNavigateBack}
        items={items}
        panelType={panelType}
      />

      <div className="container-view-content">
        {currentGrid ? (
          <ItemGrid
            grid={currentGrid}
            context={getContext()}
            cellSize={cellSize}
          />
        ) : (
          <div className="empty-container-message">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
}
