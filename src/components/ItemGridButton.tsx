import classNames from 'classnames/bind';
import type { Item } from '../types/inventory';
import type { CellState, ItemGridHandlers, CSSPropertiesWithVars } from '../types/ui';
import { FIRST_INDEX, NOT_FOUND_INDEX, SECOND_INDEX } from '../constants/numbers';
import { getImageUrl } from '../utils/images';
import { getItemIcon } from '../utils/getItemIcon';
import { calculateItemDimensions } from '../utils/calculateItemDimensions';
import styles from './ItemGridButton.module.css';

const cx = classNames.bind(styles);

interface ItemGridButtonProps {
  item: Item;
  cellSize: number;
  cellState: CellState;
  isFocused: boolean;
  handlers: ItemGridHandlers;
}

export default function ItemGridButton({
  item,
  cellSize,
  cellState,
  isFocused,
  handlers,
}: ItemGridButtonProps): React.JSX.Element {
  const { isSelected, hasOpenModal, hasGrid } = cellState;
  const { handleClick, openModal, handleMouseEnter, handleFocus } = handlers;

  const needsRotation = item.size.height > item.size.width && item.spriteVertical !== true;
  const { itemWidth, itemHeight } = calculateItemDimensions({ item, cellSize });

  const handleDoubleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    openModal(e.currentTarget);
  };
  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    openModal(e.currentTarget);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter') openModal(e.currentTarget);
  };

  const buttonStyle: CSSPropertiesWithVars = {
    width: `${itemWidth}px`,
    height: `${itemHeight}px`,
    '--item-width': `${itemWidth}px`,
    '--item-height': `${itemHeight}px`,
  };

  return (
    <button
      type="button"
      className={cx('grid-item', {
        container: hasGrid,
        selected: isSelected,
        'has-modal': hasOpenModal,
      })}
      style={buttonStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      tabIndex={isFocused ? FIRST_INDEX : NOT_FOUND_INDEX}
      aria-label={item.name}
    >
      {item.image ? (
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className={cx('item-image', { rotated: needsRotation })}
          draggable={false}
        />
      ) : (
        <span className={cx('item-icon')}>{getItemIcon({ type: item.type })}</span>
      )}
      {item.stackable && item.quantity > SECOND_INDEX ? (
        <span className={cx('item-quantity')}>x{item.quantity}</span>
      ) : null}
      {hasGrid ? <span className={cx('container-indicator')}>▼</span> : null}
    </button>
  );
}
