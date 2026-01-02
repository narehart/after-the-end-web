import { useMemo } from 'react';
import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import type { BreadcrumbLink, GridCell, ItemsMap, MenuSource, PanelType } from '../types/inventory';
import Panel from './Panel';
import ItemGrid from './ItemGrid';
import styles from './ContainerView.module.css';

const cx = classNames.bind(styles);

function useBreadcrumbLinks(
  panelLabel: string,
  focusPath: string[],
  items: ItemsMap,
  onNavigateBack: (index: number) => void,
  panelType: PanelType
): BreadcrumbLink[] {
  return useMemo(() => {
    // For world panel at ground level, don't show redundant "ground" breadcrumb
    const isGroundRoot =
      panelType === 'world' && focusPath.length === 1 && focusPath[0] === 'ground';
    if (isGroundRoot) {
      return [{ label: panelLabel }];
    }

    // First link is never clickable - it's just a label, not a container
    const links: BreadcrumbLink[] = [
      {
        label: panelLabel,
      },
    ];
    focusPath.forEach((id, index) => {
      const isLast = index === focusPath.length - 1;
      links.push({
        label: items[id]?.name ?? id,
        onClick: isLast
          ? undefined
          : () => {
              onNavigateBack(index);
            },
      });
    });
    return links;
  }, [panelLabel, focusPath, items, onNavigateBack, panelType]);
}

interface ContainerViewProps {
  focusPath: string[];
  onNavigateBack: (index: number) => void;
  emptyMessage?: string;
  panelType?: PanelType;
  panelLabel?: string;
  cellSize?: number;
}

// Main ContainerView component - reusable for both inventory and world panels
export default function ContainerView({
  focusPath,
  onNavigateBack,
  emptyMessage = 'No container selected',
  panelType = 'inventory',
  panelLabel = 'Container',
  cellSize = 32,
}: ContainerViewProps): React.JSX.Element {
  const items = useInventoryStore((state) => state.items);
  const grids = useInventoryStore((state) => state.grids);

  const lastPath = focusPath[focusPath.length - 1];
  const currentContainerId = focusPath.length > 0 && lastPath !== undefined ? lastPath : null;
  const getGrid = (id: string | null): GridCell | undefined => {
    if (id === null) return undefined;
    return grids[id];
  };
  const currentGrid = getGrid(currentContainerId);
  const breadcrumbLinks = useBreadcrumbLinks(
    panelLabel,
    focusPath,
    items,
    onNavigateBack,
    panelType
  );

  // Determine context for action modal based on panel type and current container
  const getContext = (): MenuSource => {
    if (panelType === 'world') {
      return currentContainerId === 'ground' ? 'ground' : 'world';
    }
    return 'grid';
  };

  return (
    <Panel breadcrumbLinks={breadcrumbLinks} contentClassName={cx('container-view-content')}>
      {currentGrid !== undefined ? (
        <ItemGrid grid={currentGrid} context={getContext()} cellSize={cellSize} />
      ) : (
        <div className={cx('empty-container-message')}>{emptyMessage}</div>
      )}
    </Panel>
  );
}
