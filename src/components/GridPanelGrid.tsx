import classNames from 'classnames/bind';
import { useInventoryStore } from '../stores/inventoryStore';
import useGridNavigation from '../hooks/useGridNavigation';
import type { GridCell } from '../types/inventory';
import { FIRST_INDEX } from '../constants/numbers';
import { getCellValue } from '../utils/getCellValue';
import { findItemOrigin } from '../utils/findItemOrigin';
import GridPanelCell from './GridPanelCell';
import { Box, Flex } from './primitives';
import styles from './GridPanelGrid.module.css';

const cx = classNames.bind(styles);

interface GridPanelGridProps {
  gridId: string;
  grid: GridCell;
  label?: string;
}

export default function GridPanelGrid({
  gridId,
  grid,
  label,
}: GridPanelGridProps): React.JSX.Element {
  const items = useInventoryStore((state) => state.items);
  const { focusedCell, handleNavigate, handleGridKeyDown, setCellRef } = useGridNavigation({
    width: grid.width,
    height: grid.height,
  });
  const renderedItems = new Set<string>();

  return (
    <Flex direction="column" align="center">
      {label !== undefined && label !== '' ? <Box className={cx('grid-label')}>{label}</Box> : null}
      <Box
        className={cx('inventory-grid')}
        style={{
          gridTemplateColumns: `repeat(${grid.width}, 48px)`,
          gridTemplateRows: `repeat(${grid.height}, 48px)`,
        }}
        role="grid"
        tabIndex={FIRST_INDEX}
        onKeyDown={handleGridKeyDown}
      >
        {Array.from({ length: grid.height }).map((__, row) =>
          Array.from({ length: grid.width }).map((___, col) => {
            const itemId = getCellValue({ grid, row, col });
            const item = itemId !== null ? items[itemId] : undefined;
            const cellKey = `${col}-${row}`;
            const isFocused = focusedCell.x === col && focusedCell.y === row;
            let isOrigin = false;
            if (itemId !== null && !renderedItems.has(itemId)) {
              const origin = findItemOrigin({ grid, itemId });
              if (origin !== null && origin.x === col && origin.y === row) {
                isOrigin = true;
                renderedItems.add(itemId);
              }
            }
            return (
              <GridPanelCell
                key={cellKey}
                gridId={gridId}
                x={col}
                y={row}
                itemId={itemId}
                isOrigin={isOrigin}
                item={isOrigin && item !== undefined ? item : null}
                isFocused={isFocused}
                onNavigate={handleNavigate}
                cellRef={(el): void => {
                  setCellRef(cellKey, el);
                }}
              />
            );
          })
        )}
      </Box>
    </Flex>
  );
}
