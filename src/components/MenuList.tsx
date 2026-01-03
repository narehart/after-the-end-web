import classNames from 'classnames/bind';
import { FIRST_INDEX } from '../constants/numbers';
import type { MenuItem as MenuItemType, UseMenuContextReturn } from '../types/inventory';
import MenuItem from './MenuItem';
import { Box, Text } from './primitives';
import styles from './MenuList.module.css';

const cx = classNames.bind(styles);

interface MenuListProps {
  items: MenuItemType[];
  context: UseMenuContextReturn;
  focusIndex: number;
  selectedId?: string | null;
  onSelect: (item: MenuItemType) => void;
  onSetFocusIndex?: (index: number) => void;
  onHoverItem?: (index: number) => void;
  emptyMessage?: string;
}

export default function MenuList({
  items,
  context,
  focusIndex,
  selectedId,
  onSelect,
  onSetFocusIndex,
  onHoverItem,
  emptyMessage = 'No options available',
}: MenuListProps): React.JSX.Element {
  if (items.length === FIRST_INDEX) {
    return (
      <Text type="muted" className={cx('menu-empty')}>
        {emptyMessage}
      </Text>
    );
  }

  const getMouseEnterHandler = (index: number): (() => void) | undefined => {
    if (onSetFocusIndex !== undefined)
      return (): void => {
        onSetFocusIndex(index);
      };
    if (onHoverItem !== undefined)
      return (): void => {
        onHoverItem(index);
      };
    return undefined;
  };

  return (
    <Box className={cx('menu-list')}>
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          context={context}
          isFocused={index === focusIndex}
          isSelected={item.id === selectedId}
          onSelect={onSelect}
          onMouseEnter={getMouseEnterHandler(index)}
        />
      ))}
    </Box>
  );
}
