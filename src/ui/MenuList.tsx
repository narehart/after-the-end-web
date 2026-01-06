import classNames from 'classnames/bind';
import { FIRST_INDEX } from '../constants/array';
import type { MenuItem as MenuItemType, UseMenuContextReturn } from '../types/inventory';
import MenuItem from './MenuItem';
import styles from './MenuList.module.css';
import { List, Text } from '.';

;

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
      <Text type="muted" size="sm" align="center" className={cx('menu-empty')}>
        {emptyMessage}
      </Text>
    );
  }

  return (
    <List
      dataSource={items}
      rowKey="id"
      role="listbox"
      renderItem={(item: MenuItemType, index: number): React.JSX.Element => {
        const handleMouseEnter =
          onSetFocusIndex !== undefined
            ? (): void => {
                onSetFocusIndex(index);
              }
            : onHoverItem !== undefined
              ? (): void => {
                  onHoverItem(index);
                }
              : undefined;

        return (
          <MenuItem
            item={item}
            context={context}
            isFocused={index === focusIndex}
            isSelected={item.id === selectedId}
            onSelect={onSelect}
            onMouseEnter={handleMouseEnter}
          />
        );
      }}
    />
  );
}
