import classNames from 'classnames/bind';
import type { MenuItem as MenuItemType, UseMenuContextReturn } from '../types/inventory';
import ListItem from './ListItem';
import styles from './MenuItem.module.css';

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
  const label = item.label;

  const handleClick = (): void => {
    if (isDisabled !== true) {
      onSelect(item);
    }
  };

  const state = { isFocused, isSelected, isDisabled: isDisabled === true };

  return (
    <ListItem
      icon={item.icon}
      label={label}
      meta={item.meta}
      hasArrow={item.hasChildren}
      state={state}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      className={cx('menu-item')}
    />
  );
}
