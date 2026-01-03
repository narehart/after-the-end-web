import type { RefObject } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import { useBreadcrumbLinksInventory } from '../utils/useBreadcrumbLinksInventory';
import Panel from './Panel';
import GridPanelGrid from './GridPanelGrid';
import styles from './GridPanel.module.css';

const cx = classNames.bind(styles);

interface GridPanelProps {
  groundRef: RefObject<HTMLDivElement | null>;
}

export default function GridPanel({ groundRef }: GridPanelProps): React.JSX.Element {
  const focusPath = useInventoryStore((state) => state.inventoryFocusPath);
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);
  const groundCollapsed = useInventoryStore((state) => state.groundCollapsed);
  const toggleGroundCollapsed = useInventoryStore((state) => state.toggleGroundCollapsed);
  const navigateBack = useInventoryStore((state) => state.navigateBack);

  const currentContainerId = focusPath.length > 0 ? focusPath[focusPath.length - 1] : undefined;
  const currentGrid = currentContainerId !== undefined ? grids[currentContainerId] : undefined;
  const groundGrid = grids['ground'];
  const breadcrumbLinks = useBreadcrumbLinksInventory({ focusPath, items, navigateBack });

  return (
    <div className={cx('grid-panel')}>
      <Panel breadcrumbLinks={breadcrumbLinks} contentClassName={cx('grid-content')}>
        {currentGrid !== undefined && currentContainerId !== undefined ? (
          <GridPanelGrid gridId={currentContainerId} grid={currentGrid} />
        ) : (
          <div className={cx('empty-grid-message')}>No container selected</div>
        )}
      </Panel>

      <div className={cx('ground-section', { collapsed: groundCollapsed })} ref={groundRef}>
        <Panel
          header={
            <button className={cx('ground-header')} onClick={toggleGroundCollapsed}>
              <span className={cx('ground-label')}>Ground - Abandoned Street</span>
              <span className={cx('ground-toggle')}>{groundCollapsed ? '▲' : '▼'}</span>
            </button>
          }
          className={cx('ground-panel')}
        >
          {!groundCollapsed && groundGrid !== undefined ? (
            <GridPanelGrid gridId="ground" grid={groundGrid} label="" />
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
