import { useInventoryStore } from '../stores/inventoryStore';
import useECSInventory from '../hooks/useECSInventory';
import type { GridCell, MenuSource, PanelType } from '../types/inventory';
import { FIRST_INDEX, SECOND_INDEX } from '../constants/primitives';
import { DEFAULT_CELL_SIZE } from '../constants/ui';
import { useBreadcrumbLinksContainer } from '../hooks/useBreadcrumbLinksContainer';
import ItemGrid from './ItemGrid';
import { Panel } from '.';

interface ContainerViewProps {
  focusPath: string[];
  onNavigateBack: (index: number) => void;
  emptyMessage?: string;
  panelType?: PanelType;
  panelLabel?: string;
  cellSize?: number | null;
  minRows?: number;
  minCols?: number;
}

// Main ContainerView component - reusable for both inventory and world panels
export default function ContainerView({
  focusPath,
  onNavigateBack,
  emptyMessage = 'No container selected',
  panelType = 'inventory',
  panelLabel = 'Container',
  cellSize = null,
  minRows,
  minCols,
}: ContainerViewProps): React.JSX.Element {
  const { itemsMap: items, gridsMap: grids } = useECSInventory();
  const equipment = useInventoryStore((state) => state.equipment);

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
    equipment,
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
    <Panel breadcrumbLinks={breadcrumbLinks} emptyMessage={emptyMessage}>
      {currentGrid !== undefined ? (
        <ItemGrid
          grid={currentGrid}
          context={getContext()}
          cellSize={effectiveCellSize}
          hidden={!isReady}
          minRows={minRows}
          minCols={minCols}
        />
      ) : null}
    </Panel>
  );
}
