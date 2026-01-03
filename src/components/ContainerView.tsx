import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import type { GridCell, MenuSource, PanelType } from '../types/inventory';
import { FIRST_INDEX, SECOND_INDEX, DEFAULT_CELL_SIZE } from '../constants/numbers';
import { useBreadcrumbLinksContainer } from '../utils/useBreadcrumbLinksContainer';
import Panel from './Panel';
import ItemGrid from './ItemGrid';
import styles from './ContainerView.module.css';

const cx = classNames.bind(styles);

interface ContainerViewProps {
  focusPath: string[];
  onNavigateBack: (index: number) => void;
  emptyMessage?: string;
  panelType?: PanelType;
  panelLabel?: string;
  cellSize?: number | null;
}

// Main ContainerView component - reusable for both inventory and world panels
export default function ContainerView({
  focusPath,
  onNavigateBack,
  emptyMessage = 'No container selected',
  panelType = 'inventory',
  panelLabel = 'Container',
  cellSize = null,
}: ContainerViewProps): React.JSX.Element {
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);

  const lastPath = focusPath[focusPath.length - SECOND_INDEX];
  const currentContainerId =
    focusPath.length > FIRST_INDEX && lastPath !== undefined ? lastPath : null;
  const getGrid = (id: string | null): GridCell | undefined => {
    if (id === null) return undefined;
    return grids[id];
  };
  const currentGrid = getGrid(currentContainerId);
  const breadcrumbLinks = useBreadcrumbLinksContainer({
    panelLabel,
    focusPath,
    items,
    onNavigateBack,
    panelType,
  });

  // Determine context for action modal based on panel type and current container
  const getContext = (): MenuSource => {
    if (panelType === 'world') {
      return currentContainerId === 'ground' ? 'ground' : 'world';
    }
    return 'grid';
  };

  // Hide grid until cellSize is calculated to prevent layout shift
  const isReady = cellSize !== null;
  const effectiveCellSize = cellSize ?? DEFAULT_CELL_SIZE;

  return (
    <Panel
      breadcrumbLinks={breadcrumbLinks}
      contentClassName={cx('container-view-content')}
      emptyMessage={emptyMessage}
    >
      {currentGrid !== undefined ? (
        <ItemGrid
          grid={currentGrid}
          context={getContext()}
          cellSize={effectiveCellSize}
          hidden={!isReady}
        />
      ) : null}
    </Panel>
  );
}
