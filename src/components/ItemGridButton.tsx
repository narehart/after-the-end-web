import classNames from 'classnames/bind';
import type { Item } from '../types/inventory';
import type { CellState, ItemGridHandlers, CSSPropertiesWithVars } from '../types/ui';
import { DEFAULT_QUANTITY, FIRST_INDEX, NOT_FOUND_INDEX } from '../constants/numbers';
import { getImageUrl } from '../utils/images';
import { getItemIcon } from '../utils/getItemIcon';
import { calculateItemDimensions } from '../utils/calculateItemDimensions';
import { Button, Image, Text } from './primitives';
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

  const { itemWidth, itemHeight } = calculateItemDimensions({ item, cellSize });
  const showQuantity = item.quantity !== undefined && item.quantity > DEFAULT_QUANTITY;

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
    <Button
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
        <Image
          src={getImageUrl(item.image)}
          alt={item.name}
          className={cx('item-image')}
          draggable={false}
        />
      ) : (
        <Text className={cx('item-icon')}>{getItemIcon({ type: item.type })}</Text>
      )}
      {hasGrid ? <Text className={cx('container-indicator')}>▼</Text> : null}
      {showQuantity ? <Text className={cx('item-quantity')}>x{item.quantity}</Text> : null}
    </Button>
  );
}
