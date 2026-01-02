import type { RefCallback } from 'react';
import classNames from 'classnames/bind';
import useItemGridCell from '../hooks/useItemGridCell';
import type { Item, MenuSource } from '../types/inventory';
import ItemGridButton from './ItemGridButton';
import styles from './ItemGridCell.module.css';

const cx = classNames.bind(styles);

interface ItemGridCellProps {
  x: number;
  y: number;
  itemId: string | null;
  isOrigin: boolean;
  item: Item | null;
  isFocused: boolean;
  onNavigate: (x: number, y: number) => void;
  cellRef: RefCallback<HTMLDivElement>;
  context: MenuSource;
  cellSize: number;
}

export default function ItemGridCell({
  x,
  y,
  itemId,
  isOrigin,
  item,
  isFocused,
  onNavigate,
  cellRef,
  context,
  cellSize,
}: ItemGridCellProps): React.JSX.Element {
  const { cellState, handleClick, openModal, handleMouseEnter, handleFocus } = useItemGridCell({
    x,
    y,
    itemId,
    item,
    context,
    onNavigate,
  });

  const handlers = { handleClick, openModal, handleMouseEnter, handleFocus };

  return (
    <div
      ref={cellRef}
      className={cx('grid-cell')}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
      role="gridcell"
    >
      {isOrigin && item !== null ? (
        <ItemGridButton
          item={item}
          cellSize={cellSize}
          cellState={cellState}
          isFocused={isFocused}
          handlers={handlers}
        />
      ) : null}
    </div>
  );
}
