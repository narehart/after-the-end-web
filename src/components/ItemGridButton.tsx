import classNames from 'classnames/bind';
import type { Item, ItemType } from '../types/inventory';
import { getImageUrl } from '../utils/images';
import styles from './ItemGridButton.module.css';

const cx = classNames.bind(styles);

const CELL_GAP = 2;

const ITEM_ICONS: Record<ItemType, string> = {
  container: '📦',
  consumable: '💊',
  weapon: '🗡',
  clothing: '👔',
  ammo: '🔸',
  tool: '🔦',
  accessory: '🔹',
};

function getItemIcon(type: ItemType): string {
  return ITEM_ICONS[type];
}

interface ItemDimensions {
  itemWidth: number;
  itemHeight: number;
}

function calculateItemDimensions(item: Item, cellSize: number): ItemDimensions {
  const itemWidth = item.size.width * cellSize + (item.size.width - 1) * CELL_GAP;
  const itemHeight = item.size.height * cellSize + (item.size.height - 1) * CELL_GAP;
  return { itemWidth, itemHeight };
}

interface CellState {
  isSelected: boolean;
  hasOpenModal: boolean;
  hasGrid: boolean;
}

interface Handlers {
  handleClick: () => void;
  openModal: (element: HTMLElement) => void;
  handleMouseEnter: () => void;
  handleFocus: () => void;
}

interface ItemGridButtonProps {
  item: Item;
  cellSize: number;
  cellState: CellState;
  isFocused: boolean;
  handlers: Handlers;
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
  const { itemWidth, itemHeight } = calculateItemDimensions(item, cellSize);

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

  return (
    <button
      type="button"
      className={cx('grid-item', {
        container: hasGrid,
        selected: isSelected,
        'has-modal': hasOpenModal,
      })}
      style={{
        width: `${itemWidth}px`,
        height: `${itemHeight}px`,
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- CSS custom properties require type assertion
        ...({
          '--item-width': `${itemWidth}px`,
          '--item-height': `${itemHeight}px`,
        } as React.CSSProperties),
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      tabIndex={isFocused ? 0 : -1}
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
        <span className={cx('item-icon')}>{getItemIcon(item.type)}</span>
      )}
      {item.stackable && item.quantity > 1 ? (
        <span className={cx('item-quantity')}>x{item.quantity}</span>
      ) : null}
      {hasGrid ? <span className={cx('container-indicator')}>▼</span> : null}
    </button>
  );
}
