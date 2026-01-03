import type { RefObject } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/numbers';
import { useBreadcrumbLinksInventory } from '../hooks/useBreadcrumbLinksInventory';
import Panel from './Panel';
import GridPanelGrid from './GridPanelGrid';
import { Box, Button, Text } from './primitives';
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

  const currentContainerId =
    focusPath.length > FIRST_INDEX ? focusPath[focusPath.length - SECOND_INDEX] : undefined;
  const currentGrid = currentContainerId !== undefined ? grids[currentContainerId] : undefined;
  const groundGrid = grids['ground'];
  const breadcrumbLinks = useBreadcrumbLinksInventory({ focusPath, items, navigateBack });

  return (
    <Box className={cx('grid-panel')}>
      <Panel breadcrumbLinks={breadcrumbLinks} contentClassName={cx('grid-content')}>
        {currentGrid !== undefined && currentContainerId !== undefined ? (
          <GridPanelGrid gridId={currentContainerId} grid={currentGrid} />
        ) : (
          <Box className={cx('empty-grid-message')}>No container selected</Box>
        )}
      </Panel>

      <Box className={cx('ground-section', { collapsed: groundCollapsed })} ref={groundRef}>
        <Panel
          header={
            <Button className={cx('ground-header')} onClick={toggleGroundCollapsed}>
              <Text className={cx('ground-label')}>Ground - Abandoned Street</Text>
              <Text className={cx('ground-toggle')}>{groundCollapsed ? '▲' : '▼'}</Text>
            </Button>
          }
          className={cx('ground-panel')}
        >
          {!groundCollapsed && groundGrid !== undefined ? (
            <GridPanelGrid gridId="ground" grid={groundGrid} label="" />
          ) : null}
        </Panel>
      </Box>
    </Box>
  );
}
