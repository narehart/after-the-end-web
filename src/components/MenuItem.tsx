import classNames from 'classnames/bind';
import type { MenuItem as MenuItemType, UseMenuContextReturn } from '../types/inventory';
import styles from './MenuItem.module.css';
import { ListItem, Flex, Text, Button } from '.';

const cx = classNames.bind(styles);

interface MenuItemProps {
  item: MenuItemType;
  context: UseMenuContextReturn;
  isFocused: boolean;
  isSelected: boolean;
  onSelect: (item: MenuItemType) => void;
  onMouseEnter?: (() => void) | undefined;
}

export default function MenuItem({
  item,
  context,
  isFocused,
  isSelected,
  onSelect,
  onMouseEnter,
}: MenuItemProps): React.JSX.Element {
  const isDisabled = typeof item.disabled === 'function' ? item.disabled(context) : item.disabled;

  const handleClick = (): void => {
    if (isDisabled !== true) {
      onSelect(item);
    }
  };

  return (
    <ListItem selected={isSelected} focused={isFocused} disabled={isDisabled === true}>
      <Button
        variant="ghost"
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        disabled={isDisabled === true}
        role="option"
        aria-selected={isFocused}
      >
        <Flex align="center" gap="8" className={cx('menu-item-content')}>
          {item.icon !== undefined ? (
            <Flex align="center" justify="center" className={cx('menu-item-icon')}>
              {item.icon}
            </Flex>
          ) : null}
          <Text ellipsis size="base" className={cx('menu-item-label')}>
            {item.label}
          </Text>
          {item.meta !== undefined ? (
            <Text type="muted" code className={cx('menu-item-meta')}>
              {item.meta}
            </Text>
          ) : null}
          {item.hasChildren === true ? (
            <Text type="muted" size="base" className={cx('menu-item-arrow')}>
              ›
            </Text>
          ) : null}
        </Flex>
      </Button>
    </ListItem>
  );
}
