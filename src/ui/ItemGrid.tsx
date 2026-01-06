import classNames from 'classnames/bind';
import { CELL_GAP } from '../constants/grid';
import { FIRST_INDEX } from '../constants/array';
import useECSInventory from '../hooks/useECSInventory';
import useGridNavigation from '../hooks/useGridNavigation';
import type { GridCell, MenuSource } from '../types/inventory';
import { getCellValue } from '../utils/getCellValue';
import { checkIsOrigin } from '../utils/checkIsOrigin';
import ItemGridCell from './ItemGridCell';
import styles from './ItemGrid.module.css';
import { Box, Flex } from '.';

const cx = classNames.bind(styles);

interface ItemGridProps {
  grid: GridCell;
  context: MenuSource;
  cellSize: number;
  hidden?: boolean;
}

export default function ItemGrid({
  grid,
  context,
  cellSize,
  hidden = false,
}: ItemGridProps): React.JSX.Element {
  const { itemsMap: items } = useECSInventory();
  const { focusedCell, handleNavigate, handleGridKeyDown, setCellRef } = useGridNavigation({
    width: grid.width,
    height: grid.height,
  });
  const renderedItems = new Set<string>();

  return (
    <Flex
      direction="column"
      className={cx('inventory-grid-container')}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
    >
      <Box
        className={cx('inventory-grid')}
        style={{
          gridTemplateColumns: `repeat(${grid.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.height}, ${cellSize}px)`,
          gap: `${CELL_GAP}px`,
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
            const isOrigin = checkIsOrigin({ grid, itemId, col, row, renderedItems });
            return (
              <ItemGridCell
                key={cellKey}
                x={col}
                y={row}
                itemId={itemId}
                isOrigin={isOrigin}
                item={isOrigin && item !== undefined ? item : null}
                isFocused={isFocused}
                onNavigate={handleNavigate}
                cellRef={(el: HTMLDivElement | null): void => {
                  setCellRef(cellKey, el);
                }}
                context={context}
                cellSize={cellSize}
              />
            );
          })
        )}
      </Box>
    </Flex>
  );
}
