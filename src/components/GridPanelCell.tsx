import type { RefCallback } from 'react';
import classNames from 'classnames/bind';
import useGridPanelCell from '../hooks/useGridPanelCell';
import type { Item } from '../types/inventory';
import { FIRST_INDEX, NOT_FOUND_INDEX } from '../constants/numbers';
import GridItemDisplay from './GridItemDisplay';
import { Box } from './primitives';
import styles from './GridPanelCell.module.css';

const cx = classNames.bind(styles);

interface GridPanelCellProps {
  gridId: string;
  x: number;
  y: number;
  itemId: string | null;
  isOrigin: boolean;
  item: Item | null;
  isFocused: boolean;
  onNavigate: (x: number, y: number) => void;
  cellRef: RefCallback<HTMLDivElement>;
}

export default function GridPanelCell({
  gridId,
  x,
  y,
  itemId,
  isOrigin,
  item,
  isFocused,
  onNavigate,
  cellRef,
}: GridPanelCellProps): React.JSX.Element {
  const { cellState, handleClick, openModal, handleFocus, setSelectedItem } = useGridPanelCell({
    gridId,
    x,
    y,
    itemId,
    item,
    onNavigate,
  });
  const { isSelected, hasGrid } = cellState;

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    openModal(e.currentTarget);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' && itemId !== null) {
      setSelectedItem(itemId);
      openModal(e.currentTarget);
    }
  };

  const cellClasses = cx('grid-cell', {
    occupied: itemId !== null,
    empty: itemId === null,
    selected: isSelected,
    origin: isOrigin,
    'keyboard-focused': isFocused,
  });

  return (
    <Box
      ref={cellRef}
      className={cellClasses}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      tabIndex={isFocused ? FIRST_INDEX : NOT_FOUND_INDEX}
      role="gridcell"
      aria-selected={isFocused}
    >
      {isOrigin && item !== null ? <GridItemDisplay item={item} hasGrid={hasGrid} /> : null}
    </Box>
  );
}
