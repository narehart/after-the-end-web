import { useInventoryStore } from '../stores/inventoryStore';
import GridPanelBreadcrumb from './GridPanelBreadcrumb';
import GridPanelGrid from './GridPanelGrid';
import './GridPanel.css';

export default function GridPanel({ groundRef }) {
  const focusPath = useInventoryStore((state) => state.focusPath);
  const grids = useInventoryStore((state) => state.grids);
  const groundCollapsed = useInventoryStore((state) => state.groundCollapsed);
  const toggleGroundCollapsed = useInventoryStore((state) => state.toggleGroundCollapsed);

  const currentContainerId = focusPath[focusPath.length - 1];
  const currentGrid = grids[currentContainerId];
  const groundGrid = grids['ground'];

  return (
    <div className="grid-panel">
      <GridPanelBreadcrumb />

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
