import { useMemo } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import Panel from './Panel';
import GridPanelGrid from './GridPanelGrid';
import styles from './GridPanel.module.css';

const cx = classNames.bind(styles);

function useBreadcrumbLinks(focusPath, items, navigateBack) {
  return useMemo(() => {
    // "Inventory" is never clickable - it's just a label, not a container
    const links = [{
      label: 'Inventory',
    }];
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
    <div className={cx('grid-panel')}>
      <Panel breadcrumbLinks={breadcrumbLinks} contentClassName={cx('grid-content')}>
        {currentGrid ? (
          <GridPanelGrid gridId={currentContainerId} grid={currentGrid} />
        ) : (
          <div className={cx('empty-grid-message')}>No container selected</div>
        )}
      </Panel>

      <div className={cx('ground-section', { 'collapsed': groundCollapsed })} ref={groundRef}>
        <Panel
          header={
            <button className={cx('ground-header')} onClick={toggleGroundCollapsed}>
              <span className={cx('ground-label')}>Ground - Abandoned Street</span>
              <span className={cx('ground-toggle')}>{groundCollapsed ? '▲' : '▼'}</span>
            </button>
          }
          className={cx('ground-panel')}
        >
          {!groundCollapsed && groundGrid && (
            <GridPanelGrid gridId="ground" grid={groundGrid} label="" />
          )}
        </Panel>
      </div>
    </div>
  );
}
