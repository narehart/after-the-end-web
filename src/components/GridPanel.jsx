import { useMemo } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import Breadcrumb from './Breadcrumb';
import GridPanelGrid from './GridPanelGrid';
import './GridPanel.css';

function useBreadcrumbLinks(focusPath, items, navigateBack) {
  return useMemo(() => {
    const links = [{ label: '🎒 Inventory', onClick: () => navigateBack(-1, 'inventory') }];
    focusPath.forEach((id, index) => {
      const isLast = index === focusPath.length - 1;
      links.push({
        label: items[id]?.name || id,
        onClick: isLast ? undefined : () => navigateBack(index, 'inventory'),
      });
    });
    return links;
  }, [focusPath, items, navigateBack]);
}

export default function GridPanel({ groundRef }) {
  const focusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);
  const groundCollapsed = useInventoryStore((state) => state.groundCollapsed);
  const toggleGroundCollapsed = useInventoryStore((state) => state.toggleGroundCollapsed);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  const currentContainerId = focusPath[focusPath.length - 1];
  const currentGrid = grids[currentContainerId];
  const groundGrid = grids['ground'];
  const breadcrumbLinks = useBreadcrumbLinks(focusPath, items, navigateBack);

  return (
    <div className="grid-panel">
      <Breadcrumb links={breadcrumbLinks} />

      <div className="grid-content">
        {currentGrid ? (
          <GridPanelGrid gridId={currentContainerId} grid={currentGrid} />
        ) : (
          <div className="empty-grid-message">No container selected</div>
        )}
      </div>

      <div className={`ground-section ${groundCollapsed ? 'collapsed' : ''}`} ref={groundRef}>
        <button className="ground-header" onClick={toggleGroundCollapsed}>
          <span className="ground-icon">📍</span>
          <span className="ground-label">Ground - Abandoned Street</span>
          <span className="ground-toggle">{groundCollapsed ? '▲' : '▼'}</span>
        </button>
        {!groundCollapsed && groundGrid && (
          <GridPanelGrid gridId="ground" grid={groundGrid} label="" />
        )}
      </div>
    </div>
  );
}
