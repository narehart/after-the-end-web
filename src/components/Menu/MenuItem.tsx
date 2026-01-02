import classNames from 'classnames/bind';
import ListItem from '../ListItem';
import type { MenuItem as MenuItemType, MenuContext } from '../../types/inventory';
import styles from './MenuItem.module.css';

const cx = classNames.bind(styles);

interface MenuItemProps {
  item: MenuItemType;
  context: MenuContext;
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
