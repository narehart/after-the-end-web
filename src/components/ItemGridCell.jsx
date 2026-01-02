import classNames from 'classnames/bind';
import useItemGridCell from '../hooks/useItemGridCell';
import ItemGridButton from './ItemGridButton';
import styles from './ItemGridCell.module.css';

const cx = classNames.bind(styles);

export default function ItemGridCell({ x, y, itemId, isOrigin, item, isFocused, onNavigate, cellRef, context, cellSize }) {
  const { cellState, handleClick, openModal, handleMouseEnter, handleFocus } = useItemGridCell({
    x, y, itemId, item, context, onNavigate,
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
      {isOrigin && item && (
        <ItemGridButton
          item={item}
          cellSize={cellSize}
          cellState={cellState}
          isFocused={isFocused}
          handlers={handlers}
        />
      )}
    </div>
  );
}
