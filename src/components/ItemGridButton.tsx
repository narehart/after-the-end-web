import { useState } from 'react';
import classNames from 'classnames/bind';
import type { Item } from '../types/inventory';
import type { CellState, ItemGridHandlers, CSSPropertiesWithVars } from '../types/ui';
import { DEFAULT_QUANTITY, FIRST_INDEX, NOT_FOUND_INDEX } from '../constants/numbers';
import { useInventoryStore } from '../stores/inventoryStore';
import { getImageUrl } from '../utils/images';
import { getItemIcon } from '../utils/getItemIcon';
import { calculateItemDimensions } from '../utils/calculateItemDimensions';
import styles from './ItemGridButton.module.css';
import { Flex, Icon, Text } from '.';

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
  const [isHovered, setIsHovered] = useState(false);
  const inputMode = useInventoryStore((s) => s.inputMode);
  const { isSelected, hasOpenModal, hasGrid } = cellState;
  const { handleClick, openModal, openContainer, handleMouseEnter, handleFocus } = handlers;

  const showHoverHighlight =
    (inputMode === 'pointer' && isHovered) || (inputMode === 'keyboard' && isSelected);

  const { itemWidth, itemHeight } = calculateItemDimensions({ item, cellSize });
  const showQuantity = item.quantity !== undefined && item.quantity > DEFAULT_QUANTITY;

  const handleDoubleClick = (): void => {
    if (hasGrid) {
      openContainer();
    }
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

  const handleMouseEnterWithHover = (): void => {
    setIsHovered(true);
    handleMouseEnter();
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  return (
    <Flex
      as="button"
      type="button"
      direction="column"
      justify="center"
      align="center"
      className={cx('grid-item', {
        container: hasGrid,
        highlighted: showHoverHighlight,
        'has-modal': hasOpenModal,
      })}
      style={buttonStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnterWithHover}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      tabIndex={isFocused ? FIRST_INDEX : NOT_FOUND_INDEX}
      aria-label={item.name}
    >
      {item.image ? (
        <Icon
          src={getImageUrl(item.image)}
          alt={item.name}
          size="fill"
          pixelated
          className={cx('item-image')}
        />
      ) : (
        <Text size="lg" className={cx('item-icon')}>
          {getItemIcon({ type: item.type })}
        </Text>
      )}
      {hasGrid ? (
        <Text type="muted" size="xs" className={cx('container-indicator')}>
          ▼
        </Text>
      ) : null}
      {showQuantity ? (
        <Text bold size="sm" className={cx('item-quantity')}>
          x{item.quantity}
        </Text>
      ) : null}
    </Flex>
  );
}
